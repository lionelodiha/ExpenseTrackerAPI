# 🔧 DATABASE MIGRATION NEEDED

## ⚠️ IMPORTANT - READ THIS FIRST!

I've updated your .NET backend to support profile fields (nickname, profile picture, phone, bio), but you need to create and apply a database migration on your machine.

---

## 🚀 STEPS TO APPLY MIGRATION

### **1. Pull Latest Code**
```powershell
git pull origin cursor/fix-branch-code-and-implement-web-design-e1fc
```

### **2. Navigate to Backend Folder**
```powershell
cd C:\Users\KING VINCENZO\Documents\GitHub\ExpenseTrackerAPI\backend
```

### **3. Create Migration**
```powershell
dotnet ef migrations add AddUserProfileFields
```

**You should see:**
```
Build started...
Build succeeded.
Done. To undo this action, use 'dotnet ef migrations remove'
```

### **4. Apply Migration to Database**
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

### **5. Start Backend**
```powershell
dotnet run
```

**Should see:**
```
Now listening on: http://localhost:5068
Application started. Press Ctrl+C to shut down.
```

---

## ✅ What Changed in Database

The migration will add these columns to the `Users` table:

| Column | Type | Description |
|--------|------|-------------|
| `Nickname` | string (50) | User's preferred display name |
| `ProfilePicture` | text | Base64 encoded image |
| `Phone` | string (20) | User's phone number |
| `Bio` | string (500) | User's bio/description |

---

## 🎯 After Migration

Once migration is applied, your profile page will work perfectly:

1. ✅ Upload profile picture - Won't log you out!
2. ✅ Set nickname - Shows everywhere
3. ✅ Add phone - Saved properly
4. ✅ Write bio - Persists correctly

---

## 🐛 Troubleshooting

### **Error: "dotnet ef not found"**
Install EF Core tools:
```powershell
dotnet tool install --global dotnet-ef
```

### **Error: "Build failed"**
Make sure you're in the backend folder:
```powershell
cd backend
```

### **Error: "No DbContext found"**
You should be in the correct folder. Check:
```powershell
ls *.csproj
# Should show: ExpenseTracker.csproj
```

### **Migration Already Exists?**
If you see "A migration named 'AddUserProfileFields' already exists", just update:
```powershell
dotnet ef database update
```

---

## 📋 Complete Workflow

```powershell
# 1. Pull code
git pull origin cursor/fix-branch-code-and-implement-web-design-e1fc

# 2. Go to backend
cd backend

# 3. Create migration
dotnet ef migrations add AddUserProfileFields

# 4. Apply migration
dotnet ef database update

# 5. Run backend
dotnet run
```

**Then in new terminal:**
```powershell
# 6. Run frontend
cd frontend
npm run dev
```

**Test profile page:**
1. Go to `http://localhost:5173/profile`
2. Upload a picture
3. Set nickname
4. Click "Save Changes"
5. **Should work without logging out!** ✅

---

## 🎉 What's Fixed

After running migration:

✅ Profile updates work properly  
✅ No more logout on save  
✅ Nickname displays in dashboard  
✅ Profile picture shows  
✅ Phone and bio save correctly  
✅ .NET backend fully functional  

---

**RUN THE MIGRATION NOW AND YOUR PROFILE WILL WORK!** 🚀
