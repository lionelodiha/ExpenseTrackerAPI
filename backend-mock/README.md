# 🎭 Air Pay Mock Backend

This is a lightweight mock backend server that mimics your .NET backend API. It's perfect for testing the frontend when you don't have .NET installed or when you want quick testing.

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   cd backend-mock
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Server will run on**: `http://localhost:5068`

## ✨ Features

- ✅ User registration and login
- ✅ JWT authentication
- ✅ Dashboard data with mock expenses
- ✅ In-memory data storage
- ✅ CORS enabled for frontend
- ✅ Matches your real API endpoints

## 📝 API Endpoints

All endpoints match your real .NET backend:

- **POST** `/api/v1/auth/register` - Register new user
- **POST** `/api/v1/auth/login` - Login user  
- **GET** `/api/v1/auth/me` - Get current user (requires auth)
- **POST** `/api/v1/auth/logout` - Logout (requires auth)
- **GET** `/api/v1/dashboard/summary` - Get dashboard data (requires auth)
- **GET** `/api/v1/metadata/expense-categories` - Get expense categories
- **GET** `/api/v1/metadata/payment-methods` - Get payment methods
- **GET** `/api/v1/metadata/saving-goal-statuses` - Get saving goal statuses

## 🔐 How It Works

1. Register a user with any email/password
2. Login with those credentials
3. Receive a JWT token
4. Token is automatically sent with requests
5. Access protected routes like dashboard

## ⚠️ Important Notes

- Data is stored in memory (resets on restart)
- Passwords are hashed with bcrypt
- JWT tokens expire in 24 hours
- Perfect for development/testing only

## 🔄 Switching to Real Backend

When you're ready to use the real .NET backend:

1. Stop this mock server
2. Start your .NET backend
3. Frontend will automatically work with the real API (same port: 5068)

No code changes needed!
