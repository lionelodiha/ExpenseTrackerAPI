# 🚀 Air Pay - Setup Guide

This guide will help you set up and run both the backend and frontend applications.

## Prerequisites

- **Backend**: .NET 8.0 SDK or later
- **Frontend**: Node.js 18+ and npm
- **Database**: PostgreSQL 14+ (or use Docker)

## 🗄️ Database Setup

### Option 1: Using Docker (Recommended)
```bash
docker run --name expense-tracker-db \
  -e POSTGRES_DB=expense_tracker \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:14
```

### Option 2: Local PostgreSQL
1. Install PostgreSQL
2. Create a database named `expense_tracker`
3. Update the connection string in `backend/appsettings.Development.json` if needed

## 🔧 Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Restore dependencies**:
   ```bash
   dotnet restore
   ```

3. **Apply database migrations**:
   ```bash
   dotnet ef database update
   ```
   
   If you don't have `dotnet ef` installed:
   ```bash
   dotnet tool install --global dotnet-ef
   ```

4. **Run the backend**:
   ```bash
   dotnet run
   ```

   The backend will start on: `http://localhost:5068`
   
   Swagger/API documentation: `http://localhost:5068/scalar/v1`

## 🎨 Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start on: `http://localhost:3000`

## 🔑 API Configuration

The frontend is configured to connect to the backend at `http://localhost:5068`.

You can change this in:
- `frontend/.env` - for production
- `frontend/.env.development` - for development

Current configuration:
```env
VITE_API_BASE_URL=http://localhost:5068
```

## 📝 Testing the Application

1. **Register a new account**:
   - Go to `http://localhost:3000`
   - Click "Create account" or navigate to `/register`
   - Fill in your details and register

2. **Login**:
   - Navigate to `/login`
   - Use your registered credentials
   - You'll be redirected to the dashboard

3. **Explore the dashboard**:
   - View your balance card
   - Track expenses
   - Manage budgets
   - Set savings goals

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Database connection failed
```
Solution: Make sure PostgreSQL is running and the connection string is correct
```

**Issue**: Port 5068 already in use
```
Solution: Change the port in backend/Properties/launchSettings.json
```

### Frontend Issues

**Issue**: Cannot connect to backend
```
Solution: 
1. Make sure the backend is running on port 5068
2. Check that CORS is configured (already done in appsettings.json)
3. Verify the API URL in frontend/.env
```

**Issue**: Port 3000 already in use
```
Solution: Change the port in frontend/vite.config.ts
```

## 🌟 Features

- ✅ Beautiful Air Pay dashboard design
- ✅ User authentication (Register/Login)
- ✅ Expense tracking
- ✅ Budget management
- ✅ Savings goals
- ✅ Visual analytics with charts
- ✅ Transaction history
- ✅ Responsive design

## 📚 Tech Stack

**Backend**:
- ASP.NET Core 8.0
- Entity Framework Core
- PostgreSQL
- JWT Authentication

**Frontend**:
- React 19
- TypeScript
- Vite
- Axios
- React Router

## 🔐 Default Configuration

**JWT Settings** (Development):
- SecretKey: Auto-generated secure key
- Issuer: ExpenseTrackerApp
- Audience: ExpenseTrackerUsers

**Database** (Development):
- Host: localhost
- Database: expense_tracker
- Username: postgres
- Password: postgres

## 📞 Need Help?

If you encounter any issues:
1. Check the console logs (both backend and frontend)
2. Verify all services are running
3. Ensure database migrations are applied
4. Check the API documentation at `/scalar/v1`

---

Happy tracking! 💰📊
