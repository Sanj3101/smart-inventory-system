import { OrderStatus } from "./order-status";

export interface WarehouseOrderItem {
    productId: number;
    productName: string;
    quantity: number;
}

export interface WarehouseOrder {
    id: number;
    status: OrderStatus;
    createdAt: string;
    items: WarehouseOrderItem[];
}
