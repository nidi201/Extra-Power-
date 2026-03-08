# CleanPro - Full Stack MERN App

A complete MERN stack e-commerce platform for cleaning products.

## Project Structure

```
cleanpro/
├── server/                 # Express + MongoDB backend
│   ├── index.js            # Entry point
│   ├── models/Product.js   # Mongoose product model
│   ├── routes/
│   │   ├── products.js     # CRUD product routes
│   │   └── auth.js         # Admin login route
│   ├── middleware/upload.js # Multer image upload
│   └── .env                # Environment variables
│
└── client/                 # React + Vite + Tailwind frontend
    └── src/
        ├── App.jsx          # Router + protected routes
        ├── context/AuthContext.jsx  # Login state
        └── pages/
            ├── StorePage.jsx   # Public store (/)
            ├── LoginPage.jsx   # Admin login (/admin/login)
            └── AdminPage.jsx   # Admin dashboard (/admin)
```

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) OR MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
# Edit .env if needed (default: mongodb://localhost:27017/cleanpro)
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:3000
```

## Routes

| URL | Description |
|-----|-------------|
| `http://localhost:3000/` | Public store - browse products |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:3000/admin` | Admin dashboard (protected) |

## Admin Login

Use either:
- `admin@cleaning.com` (any password, or none)
- Any email ending in `@cleanpro.com`

No real password is required (as per spec). This simulates passwordless admin access.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (supports ?category, ?search, ?status) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (multipart/form-data with image) |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/auth/login` | Admin login |

## Features

### Admin
- ✅ Upload products with image, price, category, description, badge, stock
- ✅ Edit existing products inline
- ✅ Delete products (with confirmation modal)
- ✅ Toggle Active / Draft status
- ✅ Live stock alerts for low-inventory items
- ✅ Category breakdown stats
- ✅ Total inventory value calculation

### Store (Public)
- ✅ Browse all active products
- ✅ Filter by category
- ✅ Search by name
- ✅ Skeleton loading states
- ✅ Product image display from server

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Tailwind CSS, Vite
- **Backend**: Express.js, Mongoose, Multer (image uploads)
- **Database**: MongoDB
- **Auth**: Token-based (mock, no JWT secret needed)
