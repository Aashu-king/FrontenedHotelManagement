import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.css'
})
export class OutletComponent {
  outletForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  permissionArray : any 
  pageurl : any;
  dataArray : any
  HotelTypeOptions: any[] = [];  
  Hotels: any[] = [];
  filteredHotels$: Observable<any[]> = of([]);
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<OutletComponent>, private http: HttpClient, private router: Router,@Inject(MAT_DIALOG_DATA) public data: any,) {}

  ngOnInit(): void {
    this.outletForm = this.fb.group({
      outletid: [{ value: '', disabled: true }], 
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]], 
      phoneNumber: ['', [Validators.pattern('[0-9]{10,20}')]], 
      email: ['', [Validators.email]], 
      hotelId: [''],
      HotelName: ['']
    });

    this.loadOutlets();
    this.setupOutletAutoComplete();
    if(this.data){
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })
  }

  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-hotels').subscribe((result: any) => {
      this.Hotels  = result;
      console.log("🚀 ~ ModuleComponent ~ this.httpClient.get ~ moduleTypeOptions:", this.HotelTypeOptions);
    });
  }

  private setupOutletAutoComplete(): void {
    this.filteredHotels$ = this.outletForm.get('HotelName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterOutlets(value || ''))
    );
  }

  private filterOutlets(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.Hotels.filter((option: any) => 
      option.HotelName.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedOutlet  = this.Hotels.find((type: any) => type.HotelName === event.option.value);
    if (selectedOutlet ) {
      this.outletForm.get('hotelid')?.setValue(selectedOutlet.hotelid);
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/outlet/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        this.outletForm.get('hotelid')?.setValue(this.dataArray.HotelName)
        const selectedOutlet = this.Hotels.find(Hotel => Hotel.hotelid === this.dataArray.hotelid);
    if (selectedOutlet) {
      this.outletForm.get('HotelName')?.setValue(selectedOutlet.HotelName);
    }
      }

    })
  }

  onSubmit() {
    if(!this.data) {
      if (this.outletForm.valid) {
        console.log(this.outletForm.value);
        this.http.post('http://localhost:3000/api/v1/outlet', this.outletForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.outletForm.valid) {
        console.log(this.outletForm.value);
        console.log("🚀 ~ ModuleComponent ~ onSubmit ~ this.data:", this.data)
        this.http.put(`http://localhost:3000/api/v1/outlet/${this.data}`, this.outletForm.value).subscribe(
          (response: any) => {
            console.log('Success!', response);
            this.dialogRef.close(true); 
          }
        );
      }
    }
   
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/outlet/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
