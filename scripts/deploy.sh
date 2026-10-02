#!/bin/bash

# Deploy script for Style Supply
# Usage:
#   ./scripts/deploy.sh           - Deploy this repo only
#   ./scripts/deploy.sh --all     - Deploy both frontend and backend
#   ./scripts/deploy.sh --frontend - Deploy frontend only
#   ./scripts/deploy.sh --backend  - Deploy backend only

FRONTEND_REPO="Style-Supply/web-frontend"
BACKEND_REPO="Style-Supply/web-backend"

deploy_frontend() {
  echo "Deploying frontend..."
  gh workflow run deploy.yml --repo "$FRONTEND_REPO"
  echo "Frontend deploy triggered."
}

deploy_backend() {
  echo "Deploying backend..."
  gh workflow run deploy.yml --repo "$BACKEND_REPO"
  echo "Backend deploy triggered."
}

case "${1:-}" in
  --all)
    deploy_frontend
    deploy_backend
    ;;
  --frontend)
    deploy_frontend
    ;;
  --backend)
    deploy_backend
    ;;
  *)
    # Default: deploy current repo (frontend)
    deploy_frontend
    ;;
esac
