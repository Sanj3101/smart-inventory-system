# LINQ Usage in Reports Service

## Overview

The ReportsService makes extensive use of LINQ with Entity Framework Core to perform server-side data aggregation, filtering, and projection directly at the database level.

The goal of using LINQ here is to:

- Avoid loading unnecessary data into memory

- Push computation to the database (SQL translation)

- Generate efficient, readable, and maintainable reporting queries

- Return DTOs tailored specifically for reporting needs

All queries are written in a declarative, composable style, which improves both performance and clarity.

---

## 1. Sales by Date Report

```
_context.OrderItems
    .Where(oi =>
        oi.Order.Status == OrderStatus.Delivered &&
        oi.Order.CreatedAt >= from &&
        oi.Order.CreatedAt <= to
    )
    .GroupBy(oi => oi.Order.CreatedAt.Date)
    .Select(g => new SalesByDateDto
    {
        Date = g.Key,
        TotalQuantity = g.Sum(x => x.Quantity),
        TotalRevenue = g.Sum(x => x.Quantity * x.UnitPrice)
    })
    .OrderBy(x => x.Date)
    .ToList();

```
### 🔍 Why this LINQ structure?

`Where(...)`

- Filters only delivered orders, ensuring reports reflect completed sales

- Applies date range filtering at the database level

- Prevents unnecessary records from being processed

➡️ This translates to a SQL WHERE clause, not in-memory filtering.


`GroupBy(oi => oi.Order.CreatedAt.Date)`

- Groups order items by calendar date, not by order ID

- Enables date-based aggregation for time-series charts

- Avoids post-processing in application code

➡️ This becomes a SQL GROUP BY CAST(CreatedAt AS DATE).


`Select(...)`

- Projects directly into SalesByDateDto

- Calculates:
  - Total quantity sold per day
  - Total revenue per day

- Avoids returning entity objects (clean separation of concerns)

➡️ This avoids over-fetching and keeps API responses minimal.


`OrderBy(x => x.Date)`

- Ensures chronological ordering

- Makes frontend chart rendering straightforward

- Avoids client-side sorting logic


---

## 2. Sales by Product Report

```
_context.OrderItems
    .Where(oi =>
        oi.Order.Status == OrderStatus.Delivered &&
        oi.Order.CreatedAt >= from &&
        oi.Order.CreatedAt <= to
    )
    .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
    .Select(g => new SalesByProductDto
    {
        ProductName = g.Key.Name,
        TotalQuantity = g.Sum(x => x.Quantity),
        TotalRevenue = g.Sum(x => x.Quantity * x.UnitPrice)
    })
    .OrderByDescending(x => x.TotalQuantity)
    .ToList();
```

### 🔍 Why group by { ProductId, Product.Name }?

- ProductId ensures uniqueness

- Product.Name avoids an additional join later

- EF Core can safely translate this into SQL

➡️ This balances normalization with query efficiency.


### 🔽 Why OrderByDescending(TotalQuantity)?

- Highlights top-performing products first

- Matches business expectations (most sold = most important)

- Enables easy leaderboard-style UI

---

### 3. Inventory Status Report

```
_context.WarehouseProducts
    .GroupBy(wp => new { wp.ProductId, wp.Product.Name })
    .Select(g => new InventoryStatusDto
    {
        ProductId = g.Key.ProductId,
        ProductName = g.Key.Name,
        AvailableQuantity = g.Sum(x => x.StockQuantity - x.ReservedQuantity),
        Status =
            g.Sum(x => x.StockQuantity - x.ReservedQuantity) == 0
                ? "OutOfStock"
                : g.Sum(x => x.StockQuantity - x.ReservedQuantity) < 10
                    ? "LowStock"
                    : "InStock"
    })
    .OrderBy(x => x.ProductName)
    .ToList();
```

### 🔍 Why aggregate across warehouses?

- Inventory is distributed

- Business decisions require global product availability

- Grouping merges stock from all warehouses
  

### 🔢 Why compute StockQuantity - ReservedQuantity?

- Reserved stock is not sellable

- Reflects actual available inventory

- Prevents over-promising products
  

### 🧠 Why compute Status inside LINQ?

- Business rule lives close to data

- Eliminates duplicated logic in frontend

- Ensures consistent status classification

➡️ EF Core translates this conditional logic into SQL CASE expressions


---

## 4. Top Selling Products Report

```
_context.OrderItems
    .Where(oi => oi.Order.Status == OrderStatus.Delivered)
    .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
    .Select(g => new TopProductDto
    {
        ProductId = g.Key.ProductId,
        ProductName = g.Key.Name,
        UnitsSold = g.Sum(x => x.Quantity),
        Revenue = g.Sum(x => x.Quantity * x.UnitPrice)
    })
    .OrderByDescending(x => x.UnitsSold)
    .Take(limit)
    .ToList();
```

### 🔍 Why Take(limit) at the end?

- Limits results after sorting

- Ensures only top N products are returned

- Efficient pagination-style behavior

➡️ This becomes SQL TOP / LIMIT, not client-side trimming.


## Key LINQ Design Principles Used

- ✅ Database-first computation

  All heavy operations (Where, GroupBy, Sum) are executed in SQL.

- ✅ DTO projection

  Only required fields are returned — no entity leakage.

- ✅ Single-responsibility queries

  Each query serves one business question, not multiple concerns.

- ✅ Readability + performance

  Chained LINQ is structured to read top-to-bottom like a business rule.





