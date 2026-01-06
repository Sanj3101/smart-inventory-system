# Seeded Data Documentation

This document describes the **pre-seeded demo data** available in the Smart Inventory Management System.  
The seeded data ensures that the application is **fully usable immediately after startup**, without requiring any manual data entry.

The data is designed specifically to demonstrate:
- Role-based access control
- Realistic business workflows
- End-to-end order lifecycle
- Dashboard analytics and KPIs

---

## 🔐 Authentication & Demo Password

All seeded user accounts use the following password:
`Demo@123`


This is intended **only for demonstration and evaluation purposes**.

---

## 👤 Roles Seeded

The following roles are created at application startup:

- Admin  
- Customer  
- SalesExecutive  
- WarehouseManager  
- FinanceOfficer  

Each role has dedicated permissions, dashboards, and system responsibilities.

---

## 👥 Seeded Users

### Admin
- `admin@sys.com`  
  - User, role, warehouse, and inventory management

---

### Finance Officer
- `finance@sys.com`  
  - Handles payments, invoices, and financial reports

---

### Sales Executives
- `sales1@sys.com`  
- `sales2@sys.com`  
  - Create and manage customer orders
  - Act as intermediaries between customers and warehouses

---

### Warehouse Managers
Each warehouse has a dedicated manager linked via `WarehouseId`.

| Email | Warehouse |
|------|----------|
| warehouse.blr@sys.com | Bangalore Warehouse |
| warehouse.mum@sys.com | Mumbai Warehouse |
| warehouse.del@sys.com | Delhi Warehouse |

Warehouse managers are responsible for:
- Stock management
- Order packing and shipping
- Inventory updates

---

### Customers
The following customer accounts are seeded:

- aarav.kumar@demo.com  
- neha.sharma@demo.com  
- rohit.verma@demo.com  
- ananya.singh@demo.com  
- rahul.mehta@demo.com  
- kavya.nair@demo.com  

Customers can:
- Browse products
- Place orders
- Track order status

---

## 🏢 Warehouses

Three warehouses are preconfigured:

| Name | Location |
|----|---------|
| Bangalore Warehouse | Bangalore |
| Mumbai Warehouse | Mumbai |
| Delhi Warehouse | Delhi |

Each warehouse:
- Maintains its own inventory
- Has an assigned Warehouse Manager
- Participates in order fulfillment

---

## 🗂️ Categories

The following product categories are seeded:

- Electronics  
- Home Appliances  
- Furniture  
- Clothing  
- Groceries  
- Stationery  

These categories are used to demonstrate:
- Product classification
- Filtering and reporting
- Category-based analytics

---

## 📦 Products

A diverse set of products is seeded under each category, including:

- Electronics (Phones, TVs, Accessories)
- Appliances (Microwave, Refrigerator)
- Furniture (Office Chair, Dining Table)
- Clothing (Men’s and Women’s apparel)
- Groceries (Rice, Cooking Oil)
- Stationery (Notebooks, Pens)

Some products are intentionally marked as **inactive** to demonstrate:
- Product lifecycle management
- Filtering of active vs inactive items

---

## 📊 Inventory (Warehouse Products)

Each warehouse is populated with inventory for **all products**.

For every `(Warehouse, Product)` pair:
- Stock quantity is randomly assigned
- Reserved quantity simulates pending orders

This allows:
- Low-stock alerts
- Inventory KPIs
- Warehouse-level stock comparison

---

## 🧾 Orders & Order Lifecycle

### Orders
- ~28 orders are seeded
- Orders span the **last 45 days**
- Created by either:
  - Customers
  - Sales Executives

### Order Status
Orders are randomly assigned statuses across the lifecycle:

- Created  
- Approved  
- Packed  
- Shipped  
- Delivered  

All orders are marked as **paid** to enable:
- Finance dashboards
- Revenue analytics
- Sales reports

### Order Items
Each order:
- Contains 1–3 products
- Uses realistic quantities and prices
- Is linked to a warehouse for fulfillment

---

## 📈 Analytics & Dashboards

The seeded data supports:
- KPI dashboards
- Sales-by-date reports
- Inventory health views
- Top products analytics
- Role-based reporting visibility

Evaluators can immediately navigate dashboards without creating data manually.

---

## 🧭 How Evaluators Can Explore

Suggested evaluation flow:
1. Log in as **Customer** → place/view orders
2. Log in as **Warehouse Manager** → manage stock & shipments
3. Log in as **Finance Officer** → view payments & reports
4. Log in as **Admin** → manage users, roles, and warehouses

This demonstrates the **complete system workflow**.

---

## ⚠️ Notes

- Seeded data runs only if entities do not already exist
- Safe to run multiple times without duplication
- Intended for academic and demonstration use
