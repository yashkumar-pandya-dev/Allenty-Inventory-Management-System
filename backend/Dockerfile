# backend/Dockerfile
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install system dependencies (needed for Postgres)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
# (We will create requirements.txt in the next step)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .
