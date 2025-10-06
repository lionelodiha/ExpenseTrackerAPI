# 🚀 Quick Start - Air Pay Application

## ✅ What's Been Fixed

I've configured your frontend to properly connect to your backend API. Here's what was updated:

### 1. **CORS Configuration** ✅
- Updated `backend/appsettings.json` to allow requests from `http://localhost:3000` and `http://localhost:5173`
- Updated `backend/appsettings.Development.json` with proper JWT settings and CORS configuration

### 2. **API Client Configuration** ✅
- Updated `frontend/src/services/expense-tracker-api-client.ts` to use environment variables
- Created `.env` files with the backend URL: `http://localhost:5068`

### 3. **Authentication Pages** ✅
- Redesigned Login page with Air Pay styling
- Redesigned Register page with Air Pay styling
- Both pages now properly connect to your backend API

## 🏃 How to Start the Application

### Step 1: Start the Backend

**Option A: Using Docker Compose**
```bash
# From the project root directory
docker-compose up -d
```

**Option B: Using .NET CLI** (if you have .NET installed)
```bash
# From the project root directory
cd backend
dotnet restore
dotnet ef database update  # Apply migrations
dotnet run
```

The backend should be running on: **http://localhost:5068**

### Step 2: Start the Frontend

```bash
# From the project root directory
cd frontend
npm install  # If you haven't already
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## 🔐 How to Login

### First Time Setup:

1. **Register a new account**:
   - Go to `http://localhost:3000`
   - Click on "Create account" or navigate to `/register`
   - Fill in your details:
     - Full Name (e.g., "John Doe")
     - Email (e.g., "john@example.com")
     - Password (minimum 6 characters)
     - Confirm Password
   - Click "Create Account"

2. **Login**:
   - After registration, you'll be redirected to `/login`
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to the beautiful Air Pay dashboard! 🎉

## 📋 API Endpoints Being Used

Your frontend is now configured to call these backend endpoints:

- **POST** `/api/v1/auth/register` - Register new user
- **POST** `/api/v1/auth/login` - Login user
- **GET** `/api/v1/auth/me` - Get current user profile
- **POST** `/api/v1/auth/logout` - Logout user
- **GET** `/api/v1/dashboard/summary` - Get dashboard data
- And more...

## 🔧 Configuration Files

### Backend Configuration
- `backend/appsettings.json` - Production settings
- `backend/appsettings.Development.json` - Development settings (includes JWT secret, DB connection, CORS)

### Frontend Configuration
- `frontend/.env` - API base URL configuration
- `frontend/src/services/expense-tracker-api-client.ts` - Axios client with auth interceptors

## ✨ What You Get

After logging in, you'll see:

1. **Beautiful Dashboard** with:
   - Balance card with gradient design
   - Spending statistics
   - Recent transactions
   - Expense classification charts

2. **Side Navigation** with:
   - Dashboard
   - My wallet
   - Transactions
   - Statistics
   - Settings
   - Premium upgrade section

3. **Working Authentication**:
   - JWT token storage
   - Automatic token attachment to API requests
   - Protected routes
   - Logout functionality

## 🐛 Troubleshooting

### "Cannot connect to backend"
✅ **Solution**: 
1. Make sure your backend is running on port 5068
2. Check `http://localhost:5068/scalar/v1` to see if the API docs load

### "CORS error"
✅ **Solution**: Already fixed! The backend now allows requests from localhost:3000 and localhost:5173

### "Login failed"
✅ **Solution**: 
1. Make sure you registered first
2. Check that the backend database is set up and migrations are applied
3. Verify the credentials are correct

### "Database connection error"
✅ **Solution**: 
1. Make sure PostgreSQL is running
2. Check the connection string in `backend/appsettings.Development.json`
3. Default: `Host=localhost;Database=expense_tracker;Username=postgres;Password=postgres`

## 📊 Database Setup

If your backend can't connect to the database:

```bash
# Start PostgreSQL with Docker
docker run --name expense-tracker-db \
  -e POSTGRES_DB=expense_tracker \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:14

# Then apply migrations from backend directory
cd backend
dotnet ef database update
```

## 🎯 Test Your Setup

1. ✅ Backend running on http://localhost:5068
2. ✅ Frontend running on http://localhost:3000
3. ✅ Can register a new user
4. ✅ Can login with the registered user
5. ✅ Dashboard loads with Air Pay design

## 📁 Project Structure

```
workspace/
├── backend/               # ASP.NET Core API
│   ├── Controllers/       # API endpoints
│   ├── Services/          # Business logic
│   ├── Models/            # Data models
│   └── appsettings.*.json # Configuration
│
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── services/      # API client
│   │   ├── components/    # Reusable components
│   │   └── context/       # Auth context
│   └── .env              # API URL configuration
│
└── SETUP_GUIDE.md        # Detailed setup guide
```

## 🎉 You're All Set!

Your Air Pay application is now properly configured to connect the beautiful frontend with your backend API. 

**Next steps**:
1. Start your backend
2. Start your frontend
3. Register a new account
4. Enjoy your Air Pay dashboard!

Need more help? Check out `SETUP_GUIDE.md` for detailed instructions.

Happy coding! 💰🚀
