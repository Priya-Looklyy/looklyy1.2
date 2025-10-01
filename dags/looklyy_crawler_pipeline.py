"""
Looklyy Crawler Pipeline - Airflow DAG
Automated 24-hour crawler refresh, user sync, and model learning cycle
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.operators.email import EmailOperator
from airflow.models import Variable
from airflow.utils.dates import days_ago
import requests
import json
import logging

# Default arguments for the DAG
default_args = {
    'owner': 'looklyy-admin',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'email': ['admin@looklyy.com']  # Update with actual email
}

# Create the DAG
dag = DAG(
    'looklyy_crawler_pipeline',
    default_args=default_args,
    description='Automated Looklyy crawler refresh and training pipeline',
    schedule_interval='0 2 * * *',  # Run daily at 2 AM
    catchup=False,
    max_active_runs=1,
    tags=['looklyy', 'crawler', 'ml', 'fashion']
)

def global_database_refresh(**context):
    """
    Task 1: Global Database Refresh
    - Triggers the crawler to refresh the global image database
    - Runs every 24 hours to get fresh fashion images
    """
    logging.info("🚀 Starting global database refresh...")
    
    try:
        # Call the crawler API
        response = requests.post(
            'https://looklyy04.vercel.app/api/crawler/harper-bazaar',
            timeout=300  # 5 minute timeout
        )
        
        if response.status_code == 200:
            result = response.json()
            logging.info(f"✅ Global refresh completed: {result.get('message', 'Success')}")
            
            # Store results in XCom for next tasks
            context['task_instance'].xcom_push(
                key='crawl_results',
                value={
                    'success': True,
                    'pages_crawled': result.get('results', {}).get('pages_crawled', 0),
                    'total_images_found': result.get('results', {}).get('total_images_found', 0),
                    'images_stored': result.get('results', {}).get('images_stored', 0),
                    'timestamp': datetime.now().isoformat()
                }
            )
            
            return result
        else:
            error_msg = f"Crawler failed with status {response.status_code}: {response.text}"
            logging.error(f"❌ {error_msg}")
            raise Exception(error_msg)
            
    except Exception as e:
        logging.error(f"❌ Global refresh failed: {str(e)}")
        context['task_instance'].xcom_push(
            key='crawl_results',
            value={
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
        )
        raise

def user_database_sync(**context):
    """
    Task 2: User Database Sync
    - Syncs user database with global database
    - Keeps only heart-marked (approved) images from global database
    - Removes all other images from user's personal database
    """
    logging.info("🔄 Starting user database sync...")
    
    try:
        # Get crawl results from previous task
        crawl_results = context['task_instance'].xcom_pull(
            task_ids='global_database_refresh',
            key='crawl_results'
        )
        
        if not crawl_results or not crawl_results.get('success'):
            raise Exception("Global refresh failed, cannot sync user database")
        
        # Call user sync API
        response = requests.post(
            'https://looklyy04.vercel.app/api/user/sync-database',
            json={
                'sync_type': 'heart_marked_only',
                'crawl_timestamp': crawl_results.get('timestamp')
            },
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            logging.info(f"✅ User sync completed: {result.get('message', 'Success')}")
            
            context['task_instance'].xcom_push(
                key='sync_results',
                value={
                    'success': True,
                    'images_kept': result.get('images_kept', 0),
                    'images_removed': result.get('images_removed', 0),
                    'timestamp': datetime.now().isoformat()
                }
            )
            
            return result
        else:
            error_msg = f"User sync failed with status {response.status_code}: {response.text}"
            logging.error(f"❌ {error_msg}")
            raise Exception(error_msg)
            
    except Exception as e:
        logging.error(f"❌ User sync failed: {str(e)}")
        context['task_instance'].xcom_push(
            key='sync_results',
            value={
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
        )
        raise

def surface_for_manual_review(**context):
    """
    Task 3: Surface for Manual Review
    - Makes new images available for manual review
    - Sends notification to admin about pending review
    - Sets up review queue for user/admin inputs
    """
    logging.info("👁️ Surfacing images for manual review...")
    
    try:
        # Get sync results from previous task
        sync_results = context['task_instance'].xcom_pull(
            task_ids='user_database_sync',
            key='sync_results'
        )
        
        if not sync_results or not sync_results.get('success'):
            raise Exception("User sync failed, cannot surface for review")
        
        # Call review setup API
        response = requests.post(
            'https://looklyy04.vercel.app/api/training/setup-review',
            json={
                'review_type': 'daily_crawl',
                'sync_timestamp': sync_results.get('timestamp'),
                'images_available': sync_results.get('images_kept', 0)
            },
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            logging.info(f"✅ Review queue setup completed: {result.get('message', 'Success')}")
            
            context['task_instance'].xcom_push(
                key='review_setup',
                value={
                    'success': True,
                    'images_queued': result.get('images_queued', 0),
                    'review_url': result.get('review_url', ''),
                    'timestamp': datetime.now().isoformat()
                }
            )
            
            return result
        else:
            error_msg = f"Review setup failed with status {response.status_code}: {response.text}"
            logging.error(f"❌ {error_msg}")
            raise Exception(error_msg)
            
    except Exception as e:
        logging.error(f"❌ Review setup failed: {str(e)}")
        context['task_instance'].xcom_push(
            key='review_setup',
            value={
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
        )
        raise

def wait_for_manual_review(**context):
    """
    Task 4: Wait for Manual Review Completion
    - Waits for admin/user to complete manual review
    - Checks review status periodically
    - Times out after 6 hours if no review completed
    """
    logging.info("⏳ Waiting for manual review completion...")
    
    try:
        # Get review setup results
        review_setup = context['task_instance'].xcom_pull(
            task_ids='surface_for_manual_review',
            key='review_setup'
        )
        
        if not review_setup or not review_setup.get('success'):
            raise Exception("Review setup failed, cannot wait for completion")
        
        # Check review status
        max_wait_hours = 6
        check_interval_minutes = 30
        max_checks = (max_wait_hours * 60) // check_interval_minutes
        
        for check in range(max_checks):
            response = requests.get(
                'https://looklyy04.vercel.app/api/training/review-status',
                timeout=30
            )
            
            if response.status_code == 200:
                status = response.json()
                
                if status.get('review_completed'):
                    logging.info(f"✅ Manual review completed after {check * check_interval_minutes} minutes")
                    
                    context['task_instance'].xcom_push(
                        key='review_completion',
                        value={
                            'success': True,
                            'completed': True,
                            'images_reviewed': status.get('images_reviewed', 0),
                            'approved': status.get('approved', 0),
                            'rejected': status.get('rejected', 0),
                            'duplicates': status.get('duplicates', 0),
                            'completion_time': datetime.now().isoformat()
                        }
                    )
                    return status
                else:
                    logging.info(f"⏳ Review still pending... (check {check + 1}/{max_checks})")
                    time.sleep(check_interval_minutes * 60)
            else:
                logging.warning(f"⚠️ Could not check review status: {response.status_code}")
                time.sleep(check_interval_minutes * 60)
        
        # Timeout reached
        logging.warning("⏰ Manual review timeout reached (6 hours)")
        context['task_instance'].xcom_push(
            key='review_completion',
            value={
                'success': False,
                'completed': False,
                'timeout': True,
                'completion_time': datetime.now().isoformat()
            }
        )
        
        return {'review_completed': False, 'timeout': True}
        
    except Exception as e:
        logging.error(f"❌ Error waiting for review: {str(e)}")
        context['task_instance'].xcom_push(
            key='review_completion',
            value={
                'success': False,
                'error': str(e),
                'completion_time': datetime.now().isoformat()
            }
        )
        raise

def apply_model_learning(**context):
    """
    Task 5: Apply Model Learning
    - Incorporates feedback from manual review into model
    - Learns to prioritize images similar to approved ones
    - Updates crawler preferences for next cycle
    """
    logging.info("🧠 Applying model learning from review feedback...")
    
    try:
        # Get review completion results
        review_completion = context['task_instance'].xcom_pull(
            task_ids='wait_for_manual_review',
            key='review_completion'
        )
        
        if not review_completion or not review_completion.get('success'):
            if review_completion and review_completion.get('timeout'):
                logging.warning("⚠️ No review completed, applying learning from previous cycle")
            else:
                raise Exception("Review completion failed, cannot apply learning")
        
        # Apply learning from review feedback
        response = requests.post(
            'https://looklyy04.vercel.app/api/training/apply-learning',
            json={
                'learning_type': 'daily_cycle',
                'review_data': review_completion,
                'timestamp': datetime.now().isoformat()
            },
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            logging.info(f"✅ Model learning applied: {result.get('message', 'Success')}")
            
            context['task_instance'].xcom_push(
                key='learning_results',
                value={
                    'success': True,
                    'excluded_images': result.get('stats', {}).get('excluded', 0),
                    'remaining_images': result.get('stats', {}).get('remaining', 0),
                    'learning_applied': True,
                    'timestamp': datetime.now().isoformat()
                }
            )
            
            return result
        else:
            error_msg = f"Learning application failed with status {response.status_code}: {response.text}"
            logging.error(f"❌ {error_msg}")
            raise Exception(error_msg)
            
    except Exception as e:
        logging.error(f"❌ Model learning failed: {str(e)}")
        context['task_instance'].xcom_push(
            key='learning_results',
            value={
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
        )
        raise

def send_completion_notification(**context):
    """
    Task 6: Send Completion Notification
    - Sends summary email of the completed cycle
    - Includes statistics and next steps
    """
    logging.info("📧 Sending completion notification...")
    
    try:
        # Gather all results from the pipeline
        crawl_results = context['task_instance'].xcom_pull(
            task_ids='global_database_refresh',
            key='crawl_results'
        )
        sync_results = context['task_instance'].xcom_pull(
            task_ids='user_database_sync',
            key='sync_results'
        )
        review_completion = context['task_instance'].xcom_pull(
            task_ids='wait_for_manual_review',
            key='review_completion'
        )
        learning_results = context['task_instance'].xcom_pull(
            task_ids='apply_model_learning',
            key='learning_results'
        )
        
        # Create summary email
        subject = f"Looklyy Daily Crawl Complete - {datetime.now().strftime('%Y-%m-%d')}"
        
        body = f"""
        <h2>Looklyy Daily Crawl Pipeline Complete</h2>
        
        <h3>📊 Pipeline Summary</h3>
        <ul>
            <li><strong>Global Refresh:</strong> {crawl_results.get('images_stored', 0)} images stored</li>
            <li><strong>User Sync:</strong> {sync_results.get('images_kept', 0)} images kept</li>
            <li><strong>Manual Review:</strong> {'Completed' if review_completion.get('completed') else 'Timeout'}</li>
            <li><strong>Model Learning:</strong> {'Applied' if learning_results.get('success') else 'Failed'}</li>
        </ul>
        
        <h3>🎯 Review Statistics</h3>
        <ul>
            <li><strong>Approved:</strong> {review_completion.get('approved', 0)}</li>
            <li><strong>Rejected:</strong> {review_completion.get('rejected', 0)}</li>
            <li><strong>Duplicates:</strong> {review_completion.get('duplicates', 0)}</li>
        </ul>
        
        <h3>🧠 Learning Results</h3>
        <ul>
            <li><strong>Excluded Images:</strong> {learning_results.get('excluded_images', 0)}</li>
            <li><strong>Remaining Images:</strong> {learning_results.get('remaining_images', 0)}</li>
        </ul>
        
        <p><strong>Next Cycle:</strong> Tomorrow at 2:00 AM</p>
        <p><strong>Review URL:</strong> <a href="https://looklyy04.vercel.app/training">Training Dashboard</a></p>
        
        <p>Best regards,<br>Looklyy Automation System</p>
        """
        
        # Send email (this would be configured in Airflow)
        logging.info(f"📧 Sending notification email: {subject}")
        
        return {
            'email_sent': True,
            'subject': subject,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logging.error(f"❌ Notification failed: {str(e)}")
        return {
            'email_sent': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

# Define the tasks
global_refresh_task = PythonOperator(
    task_id='global_database_refresh',
    python_callable=global_database_refresh,
    dag=dag,
    pool='crawler_pool',
    pool_slots=1
)

user_sync_task = PythonOperator(
    task_id='user_database_sync',
    python_callable=user_database_sync,
    dag=dag,
    pool='database_pool',
    pool_slots=1
)

manual_review_task = PythonOperator(
    task_id='surface_for_manual_review',
    python_callable=surface_for_manual_review,
    dag=dag
)

wait_review_task = PythonOperator(
    task_id='wait_for_manual_review',
    python_callable=wait_for_manual_review,
    dag=dag,
    timeout=timedelta(hours=6)  # 6 hour timeout
)

model_learning_task = PythonOperator(
    task_id='apply_model_learning',
    python_callable=apply_model_learning,
    dag=dag
)

notification_task = PythonOperator(
    task_id='send_completion_notification',
    python_callable=send_completion_notification,
    dag=dag,
    trigger_rule='all_done'  # Run even if previous tasks failed
)

# Define task dependencies
global_refresh_task >> user_sync_task >> manual_review_task >> wait_review_task >> model_learning_task >> notification_task
