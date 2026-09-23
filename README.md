# Authentication & Product CRUD Application

A full-stack e-commerce platform API and frontend built with Node.js, Express, MongoDB, and React.

## Features

- User Authentication using JWT (short-lived access tokens and long-lived httpOnly refresh token cookies)
- Product CRUD with protected create, update, and delete operations
- Request input and parameter validation using `express-validator` with field-level errors
- Responsive React frontend for managing authentication and product catalog

## Project Structure

```
├── backend/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── products.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on port 27017 (or MongoDB Atlas connection URI)

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Ensure the following environment variables are set:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce-assignment
   ACCESS_TOKEN_SECRET=supersecretaccesstokenkey123456
   REFRESH_TOKEN_SECRET=supersecretrefreshtokenkey123456
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```
   The backend API will run at `http://localhost:5000`.

### 2. Frontend Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will run at `http://localhost:5173`.

---

## API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user, issues access token in body & refresh token in httpOnly cookie |
| `POST` | `/api/auth/refresh-token` | Public (Cookie) | Issues a new access token using refresh token |
| `POST` | `/api/auth/logout` | Authenticated | Clears refresh token cookie and invalidates DB record |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile |

### Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/:id` | Public | Get single product by ID (validates `:id` format) |
| `POST` | `/api/products` | Authenticated | Create a new product |
| `PUT` | `/api/products/:id` | Authenticated | Update an existing product |
| `DELETE` | `/api/products/:id` | Authenticated | Delete a product |
