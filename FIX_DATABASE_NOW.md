# 🔧 FIX DATABASE - COLUMN DOES NOT EXIST

## ⚠️ Error: "column u.Bio does not exist"

This means the database migration hasn't been applied yet.

---

## 🚀 **QUICK FIX (5 Steps):**

### **Step 1: Stop the Backend**
Press `Ctrl+C` in your backend terminal

### **Step 2: Go to Backend Folder**
```powershell
cd C:\Users\KING VINCENZO\Documents\GitHub\ExpenseTrackerAPI\backend
```

### **Step 3: Create the Migration**
```powershell
dotnet ef migrations add AddUserProfileFields
```

**You should see:**
```
Build started...
Build succeeded.
Done. To undo this action, use 'dotnet ef migrations remove'
```

### **Step 4: Apply the Migration**
```powershell
dotnet ef database update
```

**You should see:**
```
Build started...
Build succeeded.
Applying migration '20250106xxxxx_AddUserProfileFields'.
Done.
```

### **Step 5: Run Backend Again**
```powershell
dotnet run
```

**Should work now!** ✅

---

## 🔍 **If "dotnet ef" Command Not Found:**

Install EF Core tools:
```powershell
dotnet tool install --global dotnet-ef
```

Then try again from Step 3.

---

## 🐛 **If Migration Already Exists:**

If you get "A migration named 'AddUserProfileFields' already exists":

```powershell
# Just apply it
dotnet ef database update
```

---

## ✅ **After Migration:**

Your database will have these new columns:
- `Nickname` (string, 50 chars)
- `ProfilePicture` (text)
- `Phone` (string, 20 chars)
- `Bio` (string, 500 chars)

---

## 🎯 **Complete Workflow:**

```powershell
# Stop backend (Ctrl+C)

cd backend

# Create migration
dotnet ef migrations add AddUserProfileFields

# Apply migration
dotnet ef database update

# Run backend
dotnet run

# Should see:
# Now listening on: http://localhost:5068
# Application started.
```

**No more "column does not exist" error!** ✅

---

**RUN THESE COMMANDS NOW!** 🚀
