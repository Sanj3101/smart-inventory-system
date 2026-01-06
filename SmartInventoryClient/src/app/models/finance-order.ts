import { OrderStatus } from "./order-status";

export interface FinanceOrderItem {
    productName: string;
    quantity: number;
    price: number;
    lineTotal: number;
}

export interface FinanceOrder {
  id: number;
  customerEmail: string;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: string;
  items: FinanceOrderItem[];
  totalAmount: number;
}
