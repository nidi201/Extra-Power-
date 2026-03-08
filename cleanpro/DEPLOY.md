# CleanPro Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Cloudinary account (free for images)

---

## Step 1: Set Up MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Create a database user (username/password)
5. Network Access: Allow All IPs (0.0.0.0/0)
6. Get connection string: Cluster → Connect → Connect your application
7. Replace `<password>` with your database password

---

## Step 2: Set Up Cloudinary (for image uploads)
1. Go to https://cloudinary.com
2. Create free account
3. Go to Dashboard to find:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 3: Deploy Server on Render

### Option A: Using GitHub (Recommended)
1. Push your code to GitHub (already done)
2. Go to https://dashboard.render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: cleanpro-server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGO_URI`: mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/cleanpro?retryWrites=true&w=majority
   - `PORT`: 5000
   - `CLOUDINARY_CLOUD_NAME`: your_cloud_name
   - `CLOUDINARY_API_KEY`: your_api_key
   - `CLOUDINARY_API_SECRET`: your_api_secret
   - `JWT_SECRET`: generate a random string
7. Click "Create Web Service"

### Option B: Using render-cli
```bash
npm install -g render-cli
render-cli login
render-cli web create --name cleanpro-server --plan free
```

---

## Step 4: Deploy Client on Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: Your Render server URL (e.g., https://cleanpro-server.onrender.com)
7. Click "Deploy"

---

## Step 5: Update Client Environment

After deploying the server, update your client's VITE_API_URL:
1. Go to your Vercel project settings
2. Add/Update environment variable:
   - `VITE_API_URL`: https://your-render-server.onrender.com
3. Redeploy

---

## Testing Your Deployment

1. Visit your Vercel URL (frontend)
2. Visit your Render URL (backend): https://cleanpro-server.onrender.com/api/products
3. Login to admin: https://your-vercel-url/admin/login
4. Default email: admin@cleaning.com

---

## Troubleshooting

### CORS Errors
Make sure your server has CORS configured for your Vercel domain:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app']
}));
```

### MongoDB Connection Issues
- Check that your IP is whitelisted in MongoDB Atlas
- Verify the connection string is correct

### Image Upload Issues
- Check Cloudinary credentials are correct
- Ensure API keys have the right permissions

