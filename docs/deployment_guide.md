# LoomAI Deployment Guide

This document outlines the procedure to deploy LoomAI to a production environment. The application is fully containerized and consists of three core components: Frontend, Backend, and MongoDB.

## Prerequisites
- Docker Engine & Docker Compose
- Node.js v18+ (for local, non-containerized testing)
- Valid API Keys for AI Providers (e.g. Anthropic, OpenAI)

## Docker Composition
The platform provides a unified `docker-compose.yml` in the root directory that orchestrates the entire application.

### Environment Configuration
Before starting, create a `.env` file in the root directory (or inject these via your CI/CD pipeline):

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongodb:27017/loomai
JWT_SECRET=<YOUR_SECURE_SECRET>
JWT_EXPIRATION=24h
LOG_LEVEL=info
ANTHROPIC_API_KEY=<YOUR_ANTHROPIC_KEY>
```

### Starting the Application

To build and run the entire LoomAI stack:

```bash
docker-compose up -d --build
```

This command will:
1. Initialize the `mongodb` service on port 27017.
2. Build the `backend` image (compiling TypeScript to JavaScript) and expose the API on port 5000.
3. Build the `frontend` image (compiling the React/Vite app into static files) and serve them via Nginx on port 3000.

### Verifying Deployment
- **Frontend Dashboard**: Open `http://localhost:3000` in your browser.
- **Backend Health Check**: Run `curl http://localhost:5000/health` (Should return `HTTP 200: OK`).

## Observability & Logging
LoomAI has been upgraded with structured JSON logging for production.
- **Backend Logs**: The backend outputs all system logs, error traces, and Morgan HTTP request logs directly to `stdout` in JSON format.
- **AI Logs**: LangGraph agent executions, token usage, and latency are logged in strict JSON formats.
- **Log Aggregation**: In a cloud environment (AWS, GCP, Azure), simply attach a Datadog agent or Promtail/Loki sidecar to capture Docker's `stdout`. The JSON format guarantees that all tags (e.g. `service: 'ai-module'`) are automatically indexed.

## Security Controls
- **Helmet**: All responses from the Node.js API include strict security headers.
- **Rate Limiting**: AI and Auth endpoints are protected by `express-rate-limit` (Max 100 requests / 15 minutes) to prevent abuse and API exhaustion.
- **Auth**: The AI Orchestrator rigidly respects JWT permissions.

## Human-in-the-Loop Backup
If the AI agents malfunction in production, no immediate business harm will occur because all mutating AI operations are routed into the `ApprovalQueue` MongoDB collection. Admins can safely discard erroneous workflows via the `/workflows/pending` API.
