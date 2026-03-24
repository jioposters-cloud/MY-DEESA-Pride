# MY-DEESA-Pride Deployment Guide

## Overview

MY-DEESA-Pride is a React + TypeScript + Vite web application for a digital concierge platform. This guide covers deployment to both Netlify and Google Cloud Run.

## Prerequisites

- Node.js 20+ installed locally
- npm or yarn package manager
- Google Gemini API Key (from https://ai.google.dev/)
- Netlify account (for Netlify deployment) or Google Cloud account (for Cloud Run)

## Local Development

### 1. Clone and Setup

```bash
git clone https://github.com/jioposters-cloud/MY-DEESA-Pride.git
cd MY-DEESA-Pride
npm install
```

### 2. Environment Variables

Create `.env.local` file in the root directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The dist folder contains production-ready files.

## Deployment Options

### Option 1: Netlify Deployment

#### Automatic Deployment (Recommended)

1. **Connect GitHub Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose `jioposters-cloud/MY-DEESA-Pride`

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

3. **Set Environment Variables**
   - In Netlify dashboard, go to Site settings → Environment
   - Add:
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `APP_URL`: Your Netlify domain (e.g., `https://mydeesa.netlify.app`)

4. **Deploy**
   - Push code to `main` branch
   - Netlify automatically builds and deploys
   - View deployment at `https://mydeesa.netlify.app` or custom domain

#### Manual Deployment

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option 2: Google Cloud Run Deployment

#### Prerequisites

- Google Cloud Project created
- Cloud Run API enabled
- Docker installed locally
- gcloud CLI installed and configured

#### Deployment Steps

1. **Build Docker Image**

```bash
docker build -t mydeesa-app:latest .
```

2. **Test Locally**

```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  mydeesa-app:latest
```

3. **Push to Google Container Registry**

```bash
# Configure gcloud
gcloud auth login
gcloud config set project PROJECT_ID

# Tag and push image
docker tag mydeesa-app:latest gcr.io/PROJECT_ID/mydeesa-app:latest
docker push gcr.io/PROJECT_ID/mydeesa-app:latest
```

4. **Deploy to Cloud Run**

```bash
gcloud run deploy mydeesa-app \
  --image gcr.io/PROJECT_ID/mydeesa-app:latest \
  --platform managed \
  --region asia-east1 \
  --port 3000 \
  --set-env-vars GEMINI_API_KEY=your_key_here,APP_URL=https://mydeesa-app-xxxxx.run.app
```

5. **View Deployment**
   - Cloud Run will provide a public URL
   - Access your app at the provided URL

#### Using Cloud Build (CI/CD)

1. **Create cloudbuild.yaml** (optional)

2. **Enable Cloud Build API**

3. **Connect GitHub Repository**
   - In Cloud Console, go to Cloud Build → Triggers
   - Create trigger for YOUR repository
   - Set build config to `Dockerfile`

4. **Automatic Deployment**
   - Push to main branch
   - Cloud Build automatically builds and pushes to Container Registry
   - Deploy manually or create Cloud Run trigger

## Environment Variables

Required environment variables:

- `GEMINI_API_KEY` (required): Your Google Gemini API key
- `APP_URL` (optional): Base URL of your application

## Deployment Comparison

| Feature | Netlify | Cloud Run |
|---------|---------|----------|
| Setup Time | ~5 minutes | ~15 minutes |
| Cost | Free tier available | Pay-per-use (cheap) |
| Auto Deploy | Yes (via Git) | Manual or Cloud Build |
| Custom Domain | Yes | Yes |
| SSL/TLS | Automatic | Automatic |
| Cold Start | ~2-3s | ~5-10s |
| Best For | Static/Frontend apps | Containerized apps |

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Key Not Working

- Verify Gemini API key is valid at https://ai.google.dev/
- Check environment variables are set correctly
- Ensure API key has necessary permissions

### Port Issues

- Netlify: Served as static site, no port needed
- Cloud Run: Uses port 3000 (configured in Dockerfile)

## Customization

### Styling
- Uses Tailwind CSS
- Config in `tailwind.config.js`
- Custom colors in Dashboard component

### Content
- Edit app screens in `src/components/`
- Dashboard: Main service grid
- Update APMC rates, weather in marquee section

### API Integration
- Gemini API integrated via `@google/genai`
- OneSignal for push notifications
- Add custom APIs in `src/services/`

## Performance Tips

1. **Image Optimization**
   - Use placeholder images via picsum.photos
   - Consider CDN for production images

2. **Code Splitting**
   - Vite automatically splits code
   - Monitor bundle size with `npm run build`

3. **Caching**
   - Netlify: Set cache headers in `netlify.toml`
   - Cloud Run: Configure Cloud CDN

## Monitoring

### Netlify
- Analytics in Site analytics
- Logs in Deploys tab
- Error tracking in Logs

### Cloud Run
- Logs in Cloud Logging
- Performance metrics in Cloud Console
- Error reporting in Cloud Error Reporting

## Security Best Practices

1. Never commit `.env` files
2. Use separate API keys for dev/prod
3. Enable HTTP-only cookies
4. Set security headers (configured in netlify.toml)
5. Regular dependency updates

## Rollback

### Netlify
- Go to Deploys tab
- Click on previous deployment
- Click "Publish deploy"

### Cloud Run
```bash
gcloud run deploy mydeesa-app \
  --image gcr.io/PROJECT_ID/mydeesa-app:previous-tag \
  --region asia-east1
```

## Support

- Gemini API docs: https://ai.google.dev/
- Netlify docs: https://docs.netlify.com/
- Cloud Run docs: https://cloud.google.com/run/docs

## License

This project is part of MY-DEESA-Pride initiative.
