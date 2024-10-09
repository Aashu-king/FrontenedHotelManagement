import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  reservationForm !: FormGroup;
  guests = [
    { guestId: 1, firstName: 'John', lastName: 'Doe' },
    { guestId: 2, firstName: 'Jane', lastName: 'Smith' }
  ];
  rooms = [
    { roomId: 1, roomNumber: '101' },
    { roomId: 2, roomNumber: '102' }
  ];

  SaveUpdateEvent: boolean = false;
  permissionArray : any 
  pageurl : any;
  dataArray : any
  
OutletTypeOptions: any[] = [];  
outlets: any[] = [];
 filteredOutlets$: Observable<any[]> = of([]);
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<ReservationComponent>,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any,private router: Router) {}

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      reservationId: [''],
      guestId: ['', Validators.required],
      roomId: ['', Validators.required],
      reservationDate: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      status: ['pending', Validators.required],
      paymentStatus: ['pending', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      specialRequests: [''],
      outletid: ['', Validators.required],
      OutletName: ['']
    });

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })

    if(this.data){
      this.getByIdData()
    }
    this.loadOutlets();
    this.setupOutletAutoComplete();
  }

  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe((result: any) => {
      this.outlets  = result;
      console.log("🚀 ~ ModuleComponent ~ this.httpClient.get ~ moduleTypeOptions:", this.OutletTypeOptions);
    });
  }

  private setupOutletAutoComplete(): void {
    this.filteredOutlets$ = this.reservationForm.get('OutletName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterOutlets(value || ''))
    );
  }

  private filterOutlets(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.outlets.filter((option: any) => 
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedOutlet  = this.outlets.find((type: any) => type.name === event.option.value);
    if (selectedOutlet ) {
      this.reservationForm.get('outletid')?.setValue(selectedOutlet .outletid);
    }
  }


  onSubmit() {
    if(!this.data){
      if (this.reservationForm.valid) {
        console.log(this.reservationForm.value);
        this.http.post('http://localhost:3000/api/v1/reservation', this.reservationForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.reservationForm.valid) {
        console.log(this.reservationForm.value);
        this.http.put(`http://localhost:3000/api/v1/reservation/${this.data}`, this.reservationForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
   
  }


  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/reservation/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        // this.guestForm.get('moduleTypeName')?.setValue(this.dataArray.moduleTypeName)
        this.reservationForm.get('outletid')?.setValue(this.dataArray.name)
        const selectedOutlet = this.outlets.find(outlet => outlet.outletid === this.dataArray.outletid);
    if (selectedOutlet) {
      this.reservationForm.get('OutletName')?.setValue(selectedOutlet.name);
    }
      }

    })
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/reservation/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      },
      (error) => {
        console.error('Error saving module:', error);
      }
    );
  }
}
