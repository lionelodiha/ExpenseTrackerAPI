# ✅ Fixed: .NET Version Mismatch

## Problem
Your backend project was configured for .NET 8.0, but you have .NET 6.0 and 9.0 installed on your machine.

## Solution
I've updated your project to use **.NET 9.0** (which you already have installed).

## What Was Changed

### File: `backend/ExpenseTracker.csproj`

**Before:**
```xml
<TargetFramework>net8.0</TargetFramework>
```

**After:**
```xml
<TargetFramework>net9.0</TargetFramework>
```

Also updated all Microsoft packages to version 9.0.9 to match.

## 🚀 Now You Can Run Your Backend!

### Step 1: Navigate to backend directory
```powershell
cd backend
```

### Step 2: Restore packages (updated versions)
```powershell
dotnet restore
```

### Step 3: Apply database migrations
```powershell
dotnet ef database update
```

**Note**: If you don't have PostgreSQL set up yet, see the database setup section below.

### Step 4: Run the backend
```powershell
dotnet run
```

The backend should now start on: **http://localhost:5068**

## 📊 What You Should See

When the backend starts successfully, you'll see something like:
```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5068
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

## 🗄️ Database Setup (If Needed)

If you haven't set up PostgreSQL yet:

### Option 1: Docker (Recommended)
```powershell
docker run --name expense-tracker-db `
  -e POSTGRES_DB=expense_tracker `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  -d postgres:14
```

### Option 2: Install PostgreSQL Locally
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. Update connection string in `backend/appsettings.Development.json` if needed

### Then Apply Migrations
```powershell
cd backend
dotnet ef database update
```

## 🔧 Troubleshooting

### Issue: "dotnet ef command not found"
**Solution**: Install EF Core tools globally
```powershell
dotnet tool install --global dotnet-ef
```

### Issue: Database connection error
**Solution**: Make sure PostgreSQL is running and check your connection string in `backend/appsettings.Development.json`

Default connection string:
```json
"DefaultConnection": "Host=localhost;Database=expense_tracker;Username=postgres;Password=postgres"
```

### Issue: Port 5068 already in use
**Solution**: The mock backend might still be running. You can either:
1. Use the mock backend (it's already working!)
2. Stop it and use the real backend:
   ```powershell
   # Stop mock backend (if running elsewhere)
   # Then start real backend
   dotnet run
   ```

## ✅ Verify It's Working

1. **Health Check**: Open browser and go to:
   - http://localhost:5068/health

2. **API Documentation**: 
   - http://localhost:5068/scalar/v1

3. **Test with your frontend**:
   - Make sure frontend is running on http://localhost:3000
   - Try to register and login
   - Should work perfectly!

## 🎯 Next Steps

1. Start backend: `dotnet run` (from backend directory)
2. Start frontend: `npm run dev` (from frontend directory)
3. Open http://localhost:3000
4. Register and login
5. Enjoy your Air Pay dashboard!

## 📝 Notes

- You now have both options:
  - **Real .NET backend** (with database persistence)
  - **Mock Node.js backend** (quick testing, in-memory data)

- Both run on the same port (5068)
- Frontend works with either one
- No code changes needed to switch between them

---

**Your backend is ready to run!** 🎉

Just run `dotnet restore` and then `dotnet run` from the backend directory.
