import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent {
  billForm!: FormGroup;
  OutletTypeOptions: any[] = [];  
  outlets: any[] = [];
  filteredOutlets$: Observable<any[]> = of([]);
  
Guestoptions: any[] = [];  
Guests: any[] = [];
filteredGuest$: Observable<any[]> = of([]);
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<BillComponent>,private http: HttpClient,private router : Router,@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.billForm = this.fb.group({
      billId: [{ value: '', disabled: true }],
      guestId: ['', [Validators.required]],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      paymentMethod: ['', [Validators.required]],
      status: ['', [Validators.required]],
      outletid: ['', [Validators.required]],
      OutletName:[''],
      GuestName: [''],
    });

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })

    this.loadOutlets();
    this.setupOutletAutoComplete();
    this.loadGuests()
    this.setupGuestAutoComplete()
  }
  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe((result: any) => {
      this.outlets  = result;
      console.log("🚀 ~ ModuleComponent ~ this.httpClient.get ~ moduleTypeOptions:", this.OutletTypeOptions);

    });
  }

  private setupOutletAutoComplete(): void {
    this.filteredOutlets$ = this.billForm.get('OutletName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterOutlets(value || ''))
    );
  }

  private loadGuests(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-guests').subscribe((result: any) => {
      this.Guests = result;  // Update the correct array
      console.log("Guests data loaded:", this.Guests);
    });
  }
  

  private setupGuestAutoComplete(): void {
    this.filteredGuest$ = this.billForm.get('GuestName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterGuests(value || ''))
    );
  }

  private filterOutlets(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.outlets.filter((option: any) => 
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private filterGuests(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.Guests.filter(guest => 
      (`${guest.firstName} ${guest.lastName}`).toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedOutlet  = this.outlets.find((type: any) => type.name === event.option.value);
    if (selectedOutlet ) {
      this.billForm.get('outletid')?.setValue(selectedOutlet .outletid);
    }
  }

  onOptionSelectedGuest(event: any): void {
    const selectedGuest = this.Guests.find(guest => 
      `${guest.firstName} ${guest.lastName}` === event.option.value
    );
    if (selectedGuest) {
      this.billForm.get('guestId')?.setValue(selectedGuest.guestId);
    }
  }

  onSubmit() {
    if(!this.data) {
      if (this.billForm.valid) {
        console.log(this.billForm.value);
        this.http.post('http://localhost:3000/api/v1/bill', this.billForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.billForm.valid) {
        console.log(this.billForm.value);
        this.http.put(`http://localhost:3000/api/v1/bill/${this.data}`, this.billForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/bill/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
