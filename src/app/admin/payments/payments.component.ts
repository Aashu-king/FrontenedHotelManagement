import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  paymentForm: FormGroup;
  isEditMode = false;
  
  SaveUpdateEvent: boolean = false;
  dataArray : any
Guestoptions: any[] = [];  
Guests: any[] = [];
PaymentDropdown: any = []
filteredGuest$: Observable<any[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<PaymentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      guestId: ['', Validators.required],
      order_id: ['', Validators.required],
      payment_date: [new Date(), Validators.required],
      payment_method: ['Cash', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      is_settled: [false, Validators.required],
      GuestName: ['']
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.paymentId) {
      this.isEditMode = true;
      this.getPaymentById(this.data.paymentId);
    }
    if(this.data && this.data.throughorder && this.data.obj){
      this.isEditMode = false;
      this.paymentForm.setValue(this.data.obj)
      console.log("🚀 ~ PaymentsComponent ~ ngOnInit ~ this.paymentForm:", this.paymentForm.value)
    }
    
    this.loadOutlets();
    this.setupOutletAutoComplete();
  }

  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-guests').subscribe((result: any) => {
      this.Guests = result;  // Update the correct array
      console.log("Guests data loaded:", this.Guests);
    });
    if (this.PaymentDropdown) {
      this.setOutlet(this.PaymentDropdown.guestId);
    }
  }
  

  private setupOutletAutoComplete(): void {
    this.filteredGuest$ = this.paymentForm.get('GuestName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterOutlets(value || ''))
    );
  }

  private filterOutlets(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.Guests.filter(guest => 
      (`${guest.firstName} ${guest.lastName}`).toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedGuest = this.Guests.find(guest => 
      `${guest.firstName} ${guest.lastName}` === event.option.value
    );
    if (selectedGuest) {
      this.paymentForm.get('guestId')?.setValue(selectedGuest.guestId);
    }
  }

  getPaymentById(paymentId: number) {
    this.http.get(`http://localhost:3000/api/v1/payments/${this.data.paymentId}`).subscribe((payment: any) => {
      // this.paymentForm.patchValue(payment);
      this.PaymentDropdown = payment
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.PaymentDropdown)
      if(this.PaymentDropdown){
       
        this.paymentForm.get('order_id')?.setValue(this.PaymentDropdown.order_id)
        this.paymentForm.get('payment_date')?.setValue(this.PaymentDropdown.payment_date)
        this.paymentForm.get('payment_method')?.setValue(this.PaymentDropdown.payment_method)
        this.paymentForm.get('amount')?.setValue(this.PaymentDropdown.amount)
        this.paymentForm.get('is_settled')?.setValue(this.PaymentDropdown.is_settled)

        if (this.Guests.length > 0) {
          this.setOutlet(this.PaymentDropdown.guestId);
        } else {
      
          this.loadOutlets();
          this.filteredGuest$.subscribe(() => {
            this.setOutlet(this.PaymentDropdown.guestId);
          });
        }

      }
    });
  }

  setOutlet(guestId: number) {
    // Find the outlet with the corresponding outletid and set the OutletName
    const selectedGuest = this.Guests.find(Guest => Guest.guestId === guestId);
    if (selectedGuest) {
      this.paymentForm.get('GuestName')?.setValue(`${selectedGuest.firstName} ${selectedGuest.lastName}`);
    }
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      if (this.isEditMode) {
        this.updatePayment();
      } else {
        this.createPayment();
      }
    }
  }

  createPayment() {
    this.http.post('http://localhost:3000/api/v1/payments', this.paymentForm.value).subscribe((result : any) => {
      console.log("🚀 ~ PaymentsComponent ~ this.http.post ~ result:", result)
      if(result && this.data.throughorder){
        this.dialogRef.close({ isSettled: result?.is_settled });
      }else{
        this.dialogRef.close();
      }
    });
  }

  updatePayment() {
    this.http.put(`http://localhost:3000/api/v1/payments/${this.data.paymentId}`, this.paymentForm.value).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
