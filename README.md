# AutoDeploy

A minimal Node.js application that is automatically built, containerized, and deployed to Google Kubernetes Engine (GKE) every time you push to `main`.

## Architecture

```
GitHub Push ──► GitHub Actions ──► Docker Build ──► Artifact Registry
                                                         │
                    GKE Cluster ◄──── kubectl apply ◄────┘
                         │
                   LoadBalancer Service
                         │
                   Public IP → "Hello from Kubernetes CI/CD"
```

## Project Structure

```
AutoDeploy/
├── app/
│   ├── index.js          # Express web server
│   └── package.json      # Node.js dependencies
├── k8s/
│   ├── deployment.yaml   # Kubernetes Deployment (1 replica)
│   └── service.yaml      # LoadBalancer Service
├── .github/workflows/
│   └── deploy.yml        # CI/CD pipeline
├── Dockerfile            # Multi-stage Docker build
├── .dockerignore
└── README.md
```

## Prerequisites

- A [Google Cloud Platform](https://cloud.google.com/) account with billing enabled
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- A GitHub repository

---

## GCP Setup

### 1. Create an Artifact Registry repository

```bash
gcloud artifacts repositories create autodeploy-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker images for AutoDeploy"
```

### 2. Create a GKE cluster

```bash
gcloud container clusters create-auto autodeploy-cluster \
  --region=us-central1
```

### 3. Create a Service Account for CI/CD

```bash
# Create the service account
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions Deployer"

# Grant required IAM roles
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/container.developer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/container.clusterViewer"

# Generate and download the key
gcloud iam service-accounts keys create github-key.json \
  --iam-account=github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 4. Add the key as a GitHub Secret

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `GCP_SA_KEY`
4. Value: paste the entire contents of `github-key.json`
5. Delete the local key file after:

```bash
rm github-key.json
```

### 5. Update workflow environment variables

Edit `.github/workflows/deploy.yml` and replace:
- `YOUR_PROJECT_ID` with your actual GCP project ID
- `REGION`, `REPOSITORY`, `CLUSTER_NAME` if you used different names

---

## How It Works

Every push to `main` triggers this pipeline:

| Step | Action |
|------|--------|
| 1 | GitHub Actions checks out the code |
| 2 | Authenticates with GCP using the service account key |
| 3 | Configures Docker for Artifact Registry |
| 4 | Builds the Docker image (tagged with commit SHA + `latest`) |
| 5 | Pushes both image tags to Artifact Registry |
| 6 | Fetches GKE cluster credentials |
| 7 | Deploys with `kubectl apply` and waits for rollout |

---

## Verify Deployment

After pushing to `main`:

```bash
# Check pod status
kubectl get pods

# Get the public IP of your service
kubectl get svc autodeploy-service

# Visit the external IP in your browser, or:
curl http://<EXTERNAL-IP>
```

You should see: `Hello from Kubernetes CI/CD`

---

## Clean Up

To tear down all GCP resources:

```bash
gcloud container clusters delete autodeploy-cluster --region=us-central1
gcloud artifacts repositories delete autodeploy-repo --location=us-central1
gcloud iam service-accounts delete github-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com
```
