# Looklyy Airflow Pipeline

Automated 24-hour crawler refresh, user sync, and model learning pipeline.

## Overview

This Airflow pipeline automates the complete Looklyy training cycle:

1. **Global Database Refresh** (2 AM daily)
2. **User Database Sync** (keeps only heart-marked images)
3. **Manual Review Setup** (surfaces images for training)
4. **Wait for Manual Review** (6-hour timeout)
5. **Apply Model Learning** (incorporates feedback)
6. **Send Completion Notification** (email summary)

## Quick Start

### 1. Setup Database Tables
```bash
curl -X POST https://looklyy04.vercel.app/api/setup-airflow-tables
```

### 2. Deploy Airflow
```bash
cd airflow
docker-compose up -d
```

### 3. Access Airflow UI
- URL: http://localhost:8080
- Username: `airflow`
- Password: `airflow`

### 4. Enable DAG
- Go to DAGs page
- Toggle "looklyy_crawler_pipeline" to ON
- Pipeline will run daily at 2 AM

## Pipeline Tasks

| Task | Description | Duration | Dependencies |
|------|-------------|----------|--------------|
| `global_database_refresh` | Crawl Harper's Bazaar for new images | ~5 min | None |
| `user_database_sync` | Keep only heart-marked images | ~2 min | global_refresh |
| `surface_for_manual_review` | Setup training queue | ~1 min | user_sync |
| `wait_for_manual_review` | Wait for admin review (6h timeout) | 0-6 hours | manual_review |
| `apply_model_learning` | Apply training feedback | ~2 min | wait_review |
| `send_completion_notification` | Email summary | ~1 min | model_learning |

## Monitoring

- **Airflow UI**: http://localhost:8080
- **Training Dashboard**: https://looklyy04.vercel.app/training
- **Admin Dashboard**: https://looklyy04.vercel.app/admin

## Configuration

Environment variables in `docker-compose.yml`:
- `AIRFLOW_UID`: User ID for file permissions
- `_AIRFLOW_WWW_USER_USERNAME`: Web UI username
- `_AIRFLOW_WWW_USER_PASSWORD`: Web UI password

## Troubleshooting

### Pipeline Fails
1. Check Airflow logs in UI
2. Verify API endpoints are accessible
3. Check database connectivity

### Manual Review Timeout
- Pipeline continues even if review times out
- Previous learning patterns are still applied

### Database Issues
- Run setup script: `/api/setup-airflow-tables`
- Check Supabase connection
- Verify RLS policies

## API Endpoints

The pipeline calls these endpoints:

- `POST /api/crawler/harper-bazaar` - Global refresh
- `POST /api/user/sync-database` - User sync
- `POST /api/training/setup-review` - Review setup
- `GET /api/training/review-status` - Check review status
- `POST /api/training/apply-learning` - Apply learning

## Database Schema

New tables created:
- `user_favorites` - Heart-marked images
- `user_database` - Synced user images
- `review_sessions` - Training sessions
- `pipeline_logs` - Airflow run logs
- `learning_patterns` - Model learning data

## Production Deployment

For production:
1. Use external PostgreSQL database
2. Set up proper authentication
3. Configure email notifications
4. Set up monitoring and alerting
5. Use Kubernetes or cloud Airflow service
