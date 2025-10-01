FROM apache/airflow:2.7.3

# Switch to root to install system dependencies
USER root

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        wget \
        git \
    && apt-get autoremove -yqq --purge \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Switch back to airflow user
USER airflow

# Install Python dependencies
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

# Copy custom configuration
COPY airflow.cfg /opt/airflow/airflow.cfg

# Set environment variables
ENV AIRFLOW__CORE__DAGS_FOLDER=/opt/airflow/dags
ENV AIRFLOW__CORE__PLUGINS_FOLDER=/opt/airflow/plugins
ENV AIRFLOW__CORE__BASE_LOG_FOLDER=/opt/airflow/logs
ENV AIRFLOW__CORE__EXECUTOR=LocalExecutor
ENV AIRFLOW__CORE__LOAD_EXAMPLES=False
ENV AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=True
ENV AIRFLOW__WEBSERVER__EXPOSE_CONFIG=True
ENV AIRFLOW__WEBSERVER__RBAC=True

# Create necessary directories
RUN mkdir -p /opt/airflow/dags /opt/airflow/logs /opt/airflow/plugins /opt/airflow/config

# Set proper permissions
USER root
RUN chown -R airflow:airflow /opt/airflow
USER airflow
