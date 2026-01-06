export interface User {
    id: string;
    email: string;
    role: string | null;
    warehouseId?: number | null;
}
