
---

# 3️⃣ `docs/FRONTEND.md` (DETAILED FRONTEND EXPLANATION)

# Frontend Documentation

This document explains the **Angular frontend** of the Smart Inventory Management System.


## 📁 Project Structure

```
frontend/
├── src/
│ ├── app/
│ │ ├── features/
│ │ ├── components/
│ │ ├── services/
│ │ └── models/
│ └── environments/
│
├── angular.json
└── package.json
```


---

## 🎨 UI Framework

- Angular Material
- Responsive layouts
- Mobile-first design
- Consistent KPI cards and dashboards

---

## 🔐 Authentication Flow

- JWT token stored securely
- Route guards for role-based access
- Navbar adapts based on user role

---

## 📊 Dashboards

Each role has a tailored dashboard:
- Admin: KPIs, users, warehouses, inventory
- Customer: Order status overview
- Warehouse: Stock & orders
- Finance: Payments & invoices
- Sales: Orders & customers

---

## 🌐 API Integration

API base URL is : `'http://localhost:5122/api/<path>'`

## ▶️ Running the Frontend
```
npm install
ng serve
```
App runs at:
`http://localhost:4200`
