# Smart Inventory Management System

A full-stack inventory management system built using **ASP.NET Core** and **Angular**.  
The system supports **role-based access**, **warehouse management**, **order lifecycle tracking**, and **analytics dashboards**.

This repository contains **both backend and frontend** code, along with **unit tests**.

---

## 📂 Repository Structure

```
smart-inventory-system/
├── backend/ # ASP.NET Core Web API + Tests
├── frontend/ # Angular application
├── docs/ # Detailed documentation
└── README.md
```


---

## 🧱 Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- xUnit (Unit Testing)

### Frontend
- Angular
- Angular Material
- RxJS
- Responsive UI (Mobile + Desktop)

---

## 👤 Roles Supported

- Admin  
- Warehouse Manager  
- Sales Executive  
- Finance Officer  
- Customer  

Each role has its own **permissions, dashboards, and workflows**.

---


### 3️⃣ Database Design Diagram 


<img width="1719" height="833" alt="image" src="https://github.com/user-attachments/assets/1b27fb5d-7da2-4b06-a602-0230bf0978a3" />

---


### 📌 Notes for Evaluator

✔ Backend port is fixed using appsettings.json and frontned base url are harcoded sorry ! :'D
```PORT : 5122```

✔ Seeded data exists

✔ All role ussers are pre-created

## ➡️ Detailed seeded data documentation:
[📄 docs/seededData.md](docs/seededData.md)

---

## 🚀 How to Run the Project (Quick Start)

### 1️⃣ Backend
```bash
cd backend/SmartInventorySystem.Api
dotnet restore
dotnet run
```
Backend runs on:
``` http://localhost:5122```

Swagger API Docs:
```http://localhost:5122/swagger```

➡️ Detailed backend documentation:
📄 [docs/BACKEND.md](docs/backend.md)

### 2️⃣ Frontend
```
cd frontend
npm install
ng serve
```
Frontend runs on: 
```http://localhost:4200```

➡️ Detailed frontend documentation:
[📄 docs/FRONTEND.md](docs/frontend.md)

### 🧪 Running Tests
Unit tests are included for backend services.

```
cd backend
dotnet test
```






