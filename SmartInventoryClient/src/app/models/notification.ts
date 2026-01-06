export interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;

    orderId?: number;
    productId?: number;
}
