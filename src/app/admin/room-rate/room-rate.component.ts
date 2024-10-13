import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-room-rate',
  templateUrl: './room-rate.component.html',
  styleUrl: './room-rate.component.css'
})
export class RoomRateComponent {
  roomRateForm !: FormGroup;
  roomTypes = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Double' }
    // Add more room types as needed
  ];

  dataArray : any
  SaveUpdateEvent: boolean = false;
OutletTypeOptions: any[] = [];  
outlets: any[] = [];
 filteredOutlets$: Observable<any[]> = of([]);
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomRateComponent>,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {}

  ngOnInit(): void {
    this.roomRateForm = this.fb.group({
      rateId: [''],
      roomTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      ratePerNight: ['', [Validators.required, Validators.min(0)]],
      outletid: ['', Validators.required],
      OutletName: ['']
    });

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

      if (this.dataArray) {
        this.setOutlet(this.dataArray.outletid);
      }
    });

    
  }

  private setupOutletAutoComplete(): void {
    this.filteredOutlets$ = this.roomRateForm.get('OutletName')!.valueChanges.pipe( 
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
      this.roomRateForm.get('outletid')?.setValue(selectedOutlet .outletid);
    }
  }

  onSubmit() {
    if(!this.data){
      if (this.roomRateForm.valid) {
        console.log(this.roomRateForm.value);
        this.http.post('http://localhost:3000/api/v1/roomRate', this.roomRateForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.roomRateForm.valid) {
        console.log(this.roomRateForm.value);
        this.http.put(`http://localhost:3000/api/v1/roomRate/${this.data}`, this.roomRateForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/roomRates/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){

        const formattedStartDate = this.formatDate(this.dataArray.startDate);
      const formattedEndDate = this.formatDate(this.dataArray.endDate);
      
        this.roomRateForm.get('roomTypeId')?.setValue(this.dataArray.roomTypeId)
        this.roomRateForm.get('startDate')?.setValue(formattedStartDate)
        this.roomRateForm.get('endDate')?.setValue(formattedEndDate)
        this.roomRateForm.get('ratePerNight')?.setValue(this.dataArray.ratePerNight)

        // const selectedModule = this.moduleTypeOptions.find(module => module.moduleId === this.dataArray.moduleId);
        // if (selectedModule) {
        //   this.roomRateForm.get('moduleId')!.setValue(selectedModule.moduleId);
        //   this.roomRateForm.get('moduleName')!.setValue(selectedModule.moduleName);
        // }
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
      this.roomRateForm.get('OutletName')?.setValue(selectedOutlet.name);
    }
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0]; // Extracts "yyyy-MM-dd"
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/roomRate/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
