import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AuthGuard } from './guards/auth-guard';
import { Categories } from './features/admin/categories/categories';
import { Products } from './features/admin/products/products';
import { CustProducts } from './features/customer/products/products';
import { Warehouses } from './features/admin/warehouses/warehouses';
import { Users } from './features/admin/users/users';
import { Stock } from './features/warehouse/stock/stock';
import { Orders } from './features/finance/orders/orders';
import { WarehouseOrders } from './features/warehouse/orders/orders';
import { Cart } from './features/customer/cart/cart';
import { MyOrders } from './features/customer/my-orders/my-orders';
import { Notifications } from './components/notifications/notifications';
import { ReportsComponent } from './features/reports/reports';
import { WarehouseReports } from './features/warehouse/warehouse-reports/warehouse-reports';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { CustomerDashboard } from './features/customer/customer-dashboard/customer-dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'notifications',
    component: Notifications
  },

  // ADMIN
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: Users },
      { path: 'categories', component: Categories },
      { path: 'products', component: Products },
      { path: 'warehouses', component: Warehouses },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  // WAREHOUSE 
  {
    path: 'warehouse',
    canActivate: [AuthGuard],
    data: { roles: ['WarehouseManager'] },
    children: [
      { path: 'stock', component: Stock },
      { path: 'orders', component: WarehouseOrders },
      { path: 'dashboard', component: WarehouseReports },
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
    ]
  },

  // CUSTOMER 
  {
    path: 'customer',
    canActivate: [AuthGuard],
    data: { roles: ['Customer'] },
    children: [
      { path: 'dashboard', component: CustomerDashboard },
      { path: 'products', component: CustProducts },
      { path: 'cart', component: Cart },
      { path: 'my-orders', component: MyOrders },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  // SALES
  {
    path: 'sales',
    canActivate: [AuthGuard],
    data: { roles: ['SalesExecutive'] },
    children: [
      { path: 'dashboard', component: CustomerDashboard },
      { path: 'products', component: CustProducts },
      { path: 'cart', component: Cart },
      { path: 'my-orders', component: MyOrders },
      { path: 'reports', component: ReportsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  // FINANCE 
  {
    path: 'finance',
    canActivate: [AuthGuard],
    data: { roles: ['FinanceOfficer'] },
    children: [
      { path: 'orders', component: Orders },
      { path: 'reports', component: ReportsComponent },
      { path: '', redirectTo: 'reports', pathMatch: 'full' },

    ]
  },


  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

