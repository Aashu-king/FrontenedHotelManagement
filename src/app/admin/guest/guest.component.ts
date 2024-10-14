import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css'
})
export class GuestComponent {
  guestForm !: FormGroup;
  idTypes = ['Passport', 'Driver\'s License', 'National ID'];
 
  SaveUpdateEvent: boolean = false;
  dataArray : any;
  permissionArray : any 
  pageurl : any;
  OutletTypeOptions: any[] = [];  
  outlets: any[] = [];
   filteredOutlets$: Observable<any[]> = of([]);
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<GuestComponent>,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any,private router: Router) {}

  ngOnInit(): void {
    this.guestForm = this.fb.group({
      guestId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      identificationType: ['', Validators.required],
      identificationNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
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
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }

    this.loadOutlets();
    this.setupOutletAutoComplete();
  }

  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe((result: any) => {
      this.outlets  = result;
      console.log("🚀 ~ ModuleComponent ~ this.httpClient.get ~ moduleTypeOptions:", this.OutletTypeOptions);
      
      if (this.dataArray) {
        this.setOutlet(this.dataArray.outletid);
      }
    });
  }

  private setupOutletAutoComplete(): void {
    this.filteredOutlets$ = this.guestForm.get('OutletName')!.valueChanges.pipe( 
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
      this.guestForm.get('outletid')?.setValue(selectedOutlet .outletid);
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/guest/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        const formattedStartDate = this.formatDate(this.dataArray.dateOfBirth);

        this.guestForm.get('firstName')?.setValue(this.dataArray.firstName)
        this.guestForm.get('lastName')?.setValue(this.dataArray.lastName)
        this.guestForm.get('email')?.setValue(this.dataArray.email)
        this.guestForm.get('phone')?.setValue(this.dataArray.phone)
        this.guestForm.get('address')?.setValue(this.dataArray.address)
        this.guestForm.get('identificationType')?.setValue(this.dataArray.identificationType)
        this.guestForm.get('identificationNumber')?.setValue(this.dataArray.identificationNumber)
        this.guestForm.get('dateOfBirth')?.setValue(formattedStartDate)

        if (this.outlets.length > 0) {
          this.setOutlet(this.dataArray.outletid);
        } else {
          // If outlets are not loaded yet, subscribe to the loadOutlets method
          this.loadOutlets();
          this.filteredOutlets$.subscribe(() => {
            this.setOutlet(this.dataArray.outletid);
          });
        }
      }

    })
  }

  setOutlet(outletid: number) {
    // Find the outlet with the corresponding outletid and set the OutletName
    const selectedOutlet = this.outlets.find(outlet => outlet.outletid === outletid);
    if (selectedOutlet) {
      this.guestForm.get('OutletName')?.setValue(selectedOutlet.name);
    }
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0]; // Extracts "yyyy-MM-dd"
  }

  onSubmit() {
    if(!this.data) {
      if (this.guestForm.valid) {
        console.log(this.guestForm.value);
        this.http.post('http://localhost:3000/api/v1/guest', this.guestForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    } else {
      if (this.guestForm.valid) {
        console.log(this.guestForm.value);
        this.http.put(`http://localhost:3000/api/v1/guest/${this.data}`, this.guestForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
 
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/guest/${this.data}`).subscribe(
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
