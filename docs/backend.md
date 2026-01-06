
# 2️⃣ `docs/BACKEND.md` (DETAILED BACKEND EXPLANATION)

# Backend Documentation

This document explains the **ASP.NET Core Web API** backend of the Smart Inventory Management System.

---

## 📁 Project Structure

```
backend/
├── SmartInventorySystem.Api/
│ ├── Controllers/
│ ├── Services/
│ ├── Models/
│ ├── Program.cs
│ ├── appsettings.json
│ └── appsettings.Development.json
│
├── SmartInventorySystem.Api.Tests/
│ ├── Products/
│ ├── Users/
│ ├── Orders/
│ └── ...
│
└── SmartInventorySystem.Api.sln
```

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based authorization using ASP.NET Core policies
- Tokens are issued on login and used for protected APIs

---

## 🗃️ Database

- SQL Server (Local)
- Entity Framework Core (Code First)
- Migrations handle schema updates

Connection string is defined in:
```appsettings.json```


---

## 🌐 API Configuration

- Base URL: `http://localhost:5122`
- Swagger enabled for API exploration


---

## 📊 Key Modules

- User Management
- Warehouse Management
- Product & Category Management
- Order Lifecycle (Created → Delivered)
- Notifications
- Reports & Analytics

---

## 🧪 Testing

- Unit tests written using **xUnit**
- In-memory database used for isolation
- Tests cover core business logic



