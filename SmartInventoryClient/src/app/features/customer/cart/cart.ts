import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../../services/customer/cart-service';
import { CustomerOrderService } from '../../../services/customer/cust-order-service';
import { AuthService } from '../../../services/auth-service';
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../models/user';
import { UserService } from '../../../services/admin/user-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  displayedColumns = ['product', 'price', 'quantity', 'total', 'actions'];
  cartItems: CartItem[] = [];
  isSalesExec = false;
  customers: User[] = [];
  selectedCustomerEmail = '';


  constructor(
    private cart: CartService,
    private orders: CustomerOrderService,
    private snack: MatSnackBar,
    private auth: AuthService,
    private users: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isSalesExec = this.auth.hasRole('SalesExecutive');
    this.cart.cartChanges().subscribe(items => {
      this.cartItems = items;
    });

    if (this.isSalesExec) {
      this.loadCustomers();
    }
  }

  loadCustomers() {
    this.users.getAll().subscribe({
      next: users => {
        this.customers = users
          .filter(u => u.role === 'Customer')
          .sort((a, b) => a.email.localeCompare(b.email));
      },
      error: () => {
        this.snack.open('Failed to load customers', 'Close', { duration: 3000 });
      }
    });
  }


  increase(item: CartItem) {
    this.cart.update(item.productId, item.quantity + 1);
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) {
      this.cart.update(item.productId, item.quantity - 1);
    }
  }

  remove(item: CartItem) {
    this.cart.remove(item.productId);
  }

  clearCart() {
    this.cart.clear();
  }

  get total(): number {
    return this.cartItems.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
  }


  confirmAndPay() {
    const ok = confirm(
      `You are about to pay ₹${this.cart.getTotal()}.\n\nProceed to place the order?`
    );
    if (!ok) return;
    this.placeOrder();
  }


  placeOrder() {
    const dto: any = {
      items: this.cartItems.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };

    if (this.isSalesExec) {
      if (!this.selectedCustomerEmail) {
        this.snack.open('Please select a customer', 'Close', { duration: 2500 });
        return;
      }

      dto.customerEmail = this.selectedCustomerEmail;
    }


    this.orders.placeOrder(dto).subscribe({
      next: () => {
        this.snack.open('Order placed successfully', 'Close', { duration: 3000 });
        this.cart.clear();
        this.cdr.detectChanges();
      },
      error: err => {
        this.snack.open(err.error?.message ?? 'Order failed', 'Close', { duration: 3000 });
      }
    });
  }

}
