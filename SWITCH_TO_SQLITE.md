# 🚀 SWITCH .NET BACKEND TO SQLITE (EASIEST)

## Why SQLite?
✅ No database server needed  
✅ No installation required  
✅ Just a local file  
✅ Perfect for development  
✅ Works immediately  

---

## 📝 STEPS TO SWITCH

### **1. Add SQLite Package**

Open PowerShell in your backend folder:

```powershell
cd backend

# Add SQLite package
dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 9.0.9
```

### **2. Update appsettings.Development.json**

Open `backend/appsettings.Development.json` and change the connection string:

**Replace this:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=expense_tracker;Username=postgres;Password=postgres"
  },
```

**With this:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=expense_tracker.db"
  },
```

### **3. Update Program.cs**

Open `backend/Program.cs`

**Find this line (around line 15-20):**
```csharp
builder.Services.AddDbContext<ExpenseTrackerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Replace with:**
```csharp
builder.Services.AddDbContext<ExpenseTrackerDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Also update the using statement at the top:**

**Find:**
```csharp
using Npgsql.EntityFrameworkCore.PostgreSQL;
```

**Replace with:**
```csharp
using Microsoft.EntityFrameworkCore.Sqlite;
```

Or just add this line if it doesn't exist:
```csharp
using Microsoft.EntityFrameworkCore;
```

### **4. Clear User Secrets (Remove Supabase)**

```powershell
cd backend
dotnet user-secrets clear
```

### **5. Create New Migration for SQLite**

```powershell
# Remove old PostgreSQL migrations
Remove-Item -Recurse -Force Migrations

# Create new SQLite migration
dotnet ef migrations add InitialCreate

# Apply migration (creates the database file)
dotnet ef database update
```

### **6. Run the Backend**

```powershell
dotnet run
```

**You should see:**
```
Now listening on: http://localhost:5068
Application started. Press Ctrl+C to shut down.
```

**No database errors!** ✅

### **7. Test It**

1. Start frontend: `cd frontend && npm run dev`
2. Go to: `http://localhost:5173/login`
3. Register new account
4. Login and test!

---

## 🔍 Verify SQLite is Working

After running `dotnet run`, you should see a new file:
```
backend/expense_tracker.db
```

This is your SQLite database file! All your data is stored here.

---

## ✅ Benefits

- ✅ No PostgreSQL installation needed
- ✅ No Supabase connection issues
- ✅ Works offline
- ✅ Easy to reset (just delete the .db file)
- ✅ Perfect for development

---

## 🔄 Reset Database

If you want to start fresh:

```powershell
cd backend

# Stop the backend (Ctrl+C)

# Delete database
Remove-Item expense_tracker.db

# Recreate
dotnet ef database update

# Restart
dotnet run
```

---

## 📊 File Structure After Setup

```
backend/
├── expense_tracker.db          ← Your SQLite database file
├── expense_tracker.db-shm      ← SQLite temp file
├── expense_tracker.db-wal      ← SQLite write-ahead log
├── Migrations/
│   └── xxxxx_InitialCreate.cs  ← SQLite migration
├── appsettings.Development.json
└── Program.cs
```

---

**FOLLOW THESE STEPS AND YOUR .NET BACKEND WILL WORK!** 🚀
