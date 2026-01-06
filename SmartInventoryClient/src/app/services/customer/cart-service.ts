import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private items$ = new BehaviorSubject<CartItem[]>([]);

  getCart(): CartItem[] {
    return this.items$.value;
  }

  cartChanges() {
    return this.items$.asObservable();
  }

  add(item: CartItem) {
    const items = [...this.items$.value];
    const existing = items.find(i => i.productId === item.productId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }

    this.items$.next(items);
  }

  update(productId: number, qty: number) {
    const items = [...this.items$.value];
    const item = items.find(i => i.productId === productId);
    if (item) item.quantity = qty;
    this.items$.next(items);
  }

  remove(productId: number) {
    this.items$.next(
      this.items$.value.filter(i => i.productId !== productId)
    );
  }

  clear() {
    this.items$.next([]);
  }

  getTotal(): number {
    return this.items$.value.reduce(
      (sum, i) => sum + i.quantity * i.unitPrice,
      0
    );
  }
}
