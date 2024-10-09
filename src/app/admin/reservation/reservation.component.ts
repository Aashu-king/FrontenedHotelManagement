import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';

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
  outlets = [
    { outletid: 1, name: 'Outlet 1' },
    { outletid: 2, name: 'Outlet 2' }
  ];
  SaveUpdateEvent: boolean = false;
  permissionArray : any 
  pageurl : any;
  dataArray : any

  billForm!: FormGroup;
  moduleTypeOptions: any[] = []; 
  filteredModuleTypes!: Observable<any[]>;
  billDetailForm!: FormGroup;
  atLeastAmountToBePaidis : any

  // permissionArray : any 
  // pageurl : any;



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
      outletid: ['', Validators.required]
    });

    this.billForm = this.fb.group({
      billId: [],
      guestId: [parseInt(this.reservationForm.get('outletid')?.value)],
      totalAmount: [, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', [Validators.required]],
      status: ['', [Validators.required]],
      outletid: [this.reservationForm.get('outletid')?.value],
    });

    this.billDetailForm = this.fb.group({
      billDetailId: [''],
      billId: [''],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      outletid: [],
    });

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    console.log("🚀 ~ ReservationComponent ~ ngOnInit ~ this.reservationForm.get('roomId')?.value:", this.reservationForm.get('roomId')?.value)
    this.reservationForm.get('checkInDate')?.valueChanges.subscribe((ele : any) =>{
      console.log(ele);
      
      if(this.reservationForm.get('roomId')?.value && this.reservationForm.get('checkInDate')?.value && this.reservationForm.get('checkOutDate')?.value){
        this.getDataForTotal()
      }
    })
    
    this.reservationForm.get('checkOutDate')?.valueChanges.subscribe((ele : any) =>{
      if(this.reservationForm.get('roomId')?.value && this.reservationForm.get('checkInDate')?.value && this.reservationForm.get('checkOutDate')?.value){
        this.getDataForTotal()
      }
    })

    this.reservationForm.get('roomId')?.valueChanges.subscribe((ele : any) =>{
      if(this.reservationForm.get('roomId')?.value && this.reservationForm.get('checkInDate')?.value && this.reservationForm.get('checkOutDate')?.value){
        this.getDataForTotal()
      }
    })

    this.reservationForm.get('guestId')?.valueChanges.subscribe((ele : any) =>{
      console.log(ele);
      
    this.billForm.get('guestId')?.setValue(parseInt(this.reservationForm.get('guestId')?.value))
    console.log("🚀 ~ ReservationComponent ~ this.reservationForm.get ~ this.billDetailForm:", this.billForm.value)
    })
    this.reservationForm.get('outletid')?.valueChanges.subscribe((ele : any) =>{
      this.billForm.get('outletid')?.setValue(parseInt(this.reservationForm.get('outletid')?.value))
      this.billDetailForm.get('outletid')?.setValue(parseInt(this.reservationForm.get('outletid')?.value))
    console.log("🚀 ~ ReservationComponent ~ this.reservationForm.get ~ this.billDetailForm:", this.billForm.value)
    console.log("🚀 ~ ReservationComponent ~ this.reservationForm.get ~ this.billDetailForm:", this.billDetailForm.value)

    })

    this.reservationForm.get('totalAmount')?.valueChanges.subscribe((ele : any) =>{
      this.billForm.get('totalAmount')?.setValue(parseInt(this.reservationForm.get('totalAmount')?.value))
    })
   

    if(this.data){
      this.getByIdData()
    }

  

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })
    
    this.billDetailForm.get('amount')?.valueChanges.subscribe((ele) => {
      console.log("🚀 ~ ReservationComponent ~ this.billDetailForm.get ~ ele:", ele)
      if(ele < this.atLeastAmountToBePaidis){
        this.billDetailForm.get('amount')?.setValue(this.atLeastAmountToBePaidis)
        //error message dikhana hai
      }
    })

    

   
    

    this.loadModuleTypeOptions();

   
  }

  onSubmit() {
    if(!this.data){
      console.log("🚀 ~ ReservationComponent ~ onSubmit ~ this.billForm.valid:", this.billForm.value)
      console.log("🚀 ~ ReservationComponent ~ onSubmit ~ this.billDetailForm.valid:", this.billDetailForm.value)
      console.log("🚀 ~ ReservationComponent ~ onSubmit ~ this.reservationForm.valid:", this.reservationForm.value)
      if (this.reservationForm.valid && this.billDetailForm.valid && this.billForm.valid) {
        let theObj = {
          reservationForm : this.reservationForm.value,
          billDetailForm : this.billDetailForm.value,
          billForm : this.billForm.value,
        }
        console.log(this.reservationForm.value);
        this.http.post('http://localhost:3000/api/v1/reservation', theObj).subscribe(
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

  getDataForTotal(){
    const params = new HttpParams()
    .set('roomId', this.reservationForm.get('roomId')?.value)
    .set('checkInDate', this.reservationForm.get('checkInDate')?.value)
    .set('checkOutDate', this.reservationForm.get('checkOutDate')?.value)
    this.http.get(`http://localhost:3000/api/v1/reservationTotal`,{params}).subscribe((result : any) => {
      const typo = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",typo)
      this.reservationForm.get('totalAmount')?.setValue(typo)
      if(typo > 0){
         this.atLeastAmountToBePaidis = (40*typo)/100
        console.log("🚀 ~ ReservationComponent ~ this.http.get ~ atLeastAmountToBePaidis:", this.atLeastAmountToBePaidis)
        this.billDetailForm.get('amount')?.setValue(this.atLeastAmountToBePaidis)
      }
    })
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/reservation/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        // this.guestForm.get('moduleTypeName')?.setValue(this.dataArray.moduleTypeName)
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

  private loadModuleTypeOptions(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe((result: any) => {
      this.moduleTypeOptions = result;
      console.log("🚀 ~ PageComponent ~ loadModuleTypeOptions ~ moduleTypeOptions:", this.moduleTypeOptions);
    });
  }


}
