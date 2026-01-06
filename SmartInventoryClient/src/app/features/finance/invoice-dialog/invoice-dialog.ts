import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../../services/finance/order-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatChipsModule } from "@angular/material/chips";
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-invoice-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule
],
  templateUrl: './invoice-dialog.html',
  styleUrl: './invoice-dialog.css'
})
export class InvoiceDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public invoice: any,
    private dialogRef: MatDialogRef<InvoiceDialog>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
