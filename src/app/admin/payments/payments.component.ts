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
    }
    
    this.loadOutlets();
    this.setupOutletAutoComplete();
  }

  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-guests').subscribe((result: any) => {
      this.Guests = result;  // Update the correct array
      console.log("Guests data loaded:", this.Guests);
    });
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
    this.http.get(`http://localhost:3000/api/v1/payments/${paymentId}`).subscribe((payment: any) => {
      this.paymentForm.patchValue(payment);
      
    });
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
