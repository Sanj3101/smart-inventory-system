export interface MenuItem {
    label: string;
    icon: string;
    route?: string;
}

export const ROLE_MENUS: Record<string, MenuItem[]> = {

    Customer: [
        { label: 'Dashboard', icon: 'dashboard', route: '/customer/dashboard' },
        { label: 'Products', icon: 'shopping_bag', route: '/customer/products' },
        { label: 'Cart', icon: 'shopping_cart', route: '/customer/cart' },
        { label: 'My Orders', icon: 'local_shipping', route: '/customer/my-orders' }
    ],

    SalesExecutive: [
        { label: 'Dashboard', icon: 'dashboard', route: '/customer/dashboard' },
        { label: 'Products', icon: 'shopping_bag', route: '/sales/products' },
        { label: 'Cart', icon: 'shopping_cart', route: '/sales/cart' },
        { label: 'My Orders', icon: 'local_shipping', route: '/sales/my-orders' },
        { label: 'Analytics', icon: 'insights', route: '/sales/reports' }
    ],

    WarehouseManager: [
        { label: 'Dashboard', icon: 'dashboard', route: '/warehouse/dashboard' },
        { label: 'Orders', icon: 'inventory', route: '/warehouse/orders' },
        { label: 'Inventory', icon: 'warehouse', route: '/warehouse/stock' }
    ],

    FinanceOfficer: [
        { label: 'Orders', icon: 'receipt_long', route: '/finance/orders' },
        { label: 'Analytics', icon: 'insights', route: '/finance/reports' }
    ],

    Admin: [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
        { label: 'Users', icon: 'people', route: '/admin/users' },
        { label: 'Categories', icon: 'category', route: '/admin/categories' },
        { label: 'Products', icon: 'inventory_2', route: '/admin/products' },
        { label: 'Warehouses', icon: 'warehouse', route: '/admin/warehouses' }
    ]
};
