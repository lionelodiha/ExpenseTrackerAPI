# 🪟 Windows Setup - Start Backend on Your Machine

## The Problem

Your frontend is running on **your Windows PC**, but it's trying to connect to `localhost:5068` - which needs to be running **on your PC too**, not in the remote workspace.

## ✅ Solution: Start Backend on Your Windows PC

You have **2 options**:

---

## Option 1: Mock Backend (Easiest - No Database Needed) ⭐ RECOMMENDED

### Step 1: Open PowerShell or Command Prompt

Navigate to your project directory:
```powershell
cd "C:\Users\KING VINCENZO\Documents\GitHub\ExpenseTrackerAPI"
```

### Step 2: Install Node.js (if you don't have it)

Check if you have Node.js:
```powershell
node --version
```

If not installed, download from: https://nodejs.org/ (get LTS version)

### Step 3: Install Mock Backend Dependencies

```powershell
cd backend-mock
npm install
```

### Step 4: Start the Mock Backend

```powershell
npm start
```

**You should see:**
```
🎭 ========================================
    Air Pay Mock Backend Server
========================================

✅ Server running on: http://localhost:5068
```

### Step 5: Test It

Open browser and go to: http://localhost:5068/health

**Leave this terminal open!** The backend needs to keep running.

---

## Option 2: Real .NET Backend (Requires Database)

You already have .NET 9.0 installed, so this will work!

### Step 1: Set Up PostgreSQL Database

**Using Docker** (if you have Docker Desktop):
```powershell
docker run --name expense-tracker-db `
  -e POSTGRES_DB=expense_tracker `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  -d postgres:14
```

**OR Download PostgreSQL**:
- Get it from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember your postgres password

### Step 2: Navigate to Backend

```powershell
cd "C:\Users\KING VINCENZO\Documents\GitHub\ExpenseTrackerAPI\backend"
```

### Step 3: Restore Packages

```powershell
dotnet restore
```

### Step 4: Install EF Core Tools (if not already installed)

```powershell
dotnet tool install --global dotnet-ef
```

### Step 5: Apply Database Migrations

```powershell
dotnet ef database update
```

### Step 6: Run the Backend

```powershell
dotnet run
```

**You should see:**
```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5068
```

**Leave this terminal open!** The backend needs to keep running.

---

## Now Test Your Frontend

1. **Backend is running** ✅ (in one terminal - keep it open!)

2. **Start frontend** (open a NEW PowerShell window):
   ```powershell
   cd "C:\Users\KING VINCENZO\Documents\GitHub\ExpenseTrackerAPI\frontend"
   npm run dev
   ```

3. **Open browser**: http://localhost:3000

4. **Register a new account**:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123

5. **Login** with those credentials

6. **See your Air Pay dashboard!** 🎉

---

## Quick Troubleshooting

### "Port 5068 is already in use"

Find and kill the process:
```powershell
netstat -ano | findstr :5068
```

Note the PID (last column), then:
```powershell
taskkill /PID <number> /F
```

### "Cannot find module" (Mock Backend)

Make sure you ran:
```powershell
cd backend-mock
npm install
```

### "Database connection failed" (Real Backend)

1. Check PostgreSQL is running
2. Verify connection string in `backend/appsettings.Development.json`
3. Default connection:
   ```json
   "DefaultConnection": "Host=localhost;Database=expense_tracker;Username=postgres;Password=postgres"
   ```

---

## 🎯 My Recommendation

**Use the Mock Backend first** to test your frontend:

1. ✅ No database setup needed
2. ✅ Quick to start
3. ✅ Works perfectly for testing
4. ✅ Same API endpoints as real backend

Then switch to the real backend later when you need database persistence.

---

## Summary

**You need to run the backend on YOUR Windows PC, not in the remote workspace!**

Choose one:
- **Mock Backend**: `cd backend-mock` → `npm install` → `npm start`
- **Real Backend**: `cd backend` → `dotnet restore` → `dotnet run`

**Then your login will work!** 🚀
