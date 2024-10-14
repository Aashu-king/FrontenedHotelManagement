import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.css'
})
export class OrderItemsComponent {
  orderItemForm!: FormGroup;
  orderItemData: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.orderItemForm = this.fb.group({
      order_item_id: [{ value: '', disabled: true }],
      order_id: ['', Validators.required],
      menu_item_id: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });

    // Fetch existing data based on order_item_id
    this.getOrderItemData(this.data.order_item_id);
  }

  getOrderItemData(order_item_id: number): void {
    console.log("🚀 ~ OrderItemsComponent ~ getOrderItemData ~ order_item_id:", order_item_id)
    this.http.get(`http://localhost:3000/api/v1/order-items/${order_item_id}`).subscribe(
      (response: any) => {
        this.orderItemData = response;
        console.log("🚀 ~ OrderItemsComponent ~ getOrderItemData ~ this.orderItemData:", this.orderItemData)
        this.populateForm(response);
      },
      (error) => {
        console.error('Error fetching order item data', error);
      }
    );
  }

  populateForm(data: any): void {
    this.orderItemForm.patchValue({
      order_item_id: data.order_item_id,
      order_id: data.order_id,
      menu_item_id: data.menu_item_id,
      quantity: data.quantity,
      price: data.price,
    });
  }

  onSave(): void {
    if (this.orderItemForm.valid) {
      const updatedData = this.orderItemForm.getRawValue(); // Get form values

      // Call API to save the updated data
      this.http.put(`http://localhost:3000/api/v1/order-items/${this.data.order_item_id}`, updatedData).subscribe(
        () => {
          this.dialogRef.close(true); // Close dialog on successful save
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
