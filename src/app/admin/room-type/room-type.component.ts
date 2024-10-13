import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrl: './room-type.component.css'
})
export class RoomTypeComponent {
  roomTypeForm !: FormGroup;
  amenitiesList = ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar'];
  SaveUpdateEvent: boolean = false;
isUpdateMode: any;
dataArray : any
OutletTypeOptions: any[] = [];  
outlets: any[] = [];
 filteredOutlets$: Observable<any[]> = of([]);

  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomTypeComponent>,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('yooo');

  }

  ngOnInit(): void {
    console.log('yooo0');

    this.roomTypeForm = this.fb.group({
      roomTypeId: [''],
      typeName: [''],
      description: [''],
      baseRate: [''],
      maxOccupancy: [''],
      amenities: [],
      outletid: [''],
      OutletName: [''],
    });

    this.getDropdown()
    if(this.data){
      this.getById()
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
    this.filteredOutlets$ = this.roomTypeForm.get('OutletName')!.valueChanges.pipe( 
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
      this.roomTypeForm.get('outletid')?.setValue(selectedOutlet .outletid);
    }
  }

  onSubmit() {
    if(!this.data){
      if (this.roomTypeForm.valid) {
        console.log(this.roomTypeForm.value);
        this.http.post('http://localhost:3000/api/v1/room-type', this.roomTypeForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      this.http.put(`http://localhost:3000/api/v1/room-type/${this.data}`, this.roomTypeForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  
  }

  getDropdown(){
    console.log('yooo');
    
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe(
      (response : any) => {
        console.log('Success!', response);
        this.outlets = response
      }
    );

  }

  getById(){
    this.http.get(`http://localhost:3000/api/v1/room-type/${this.data}`).subscribe(
      (response : any) => {
        console.log('Success!', response);
        if(response){
          this.roomTypeForm.get('typeName')?.setValue(response.typeName)
          this.roomTypeForm.get('description')?.setValue(response.description)
          this.roomTypeForm.get('baseRate')?.setValue(response.baseRate)
          this.roomTypeForm.get('maxOccupancy')?.setValue(response.maxOccupancy)
          this.roomTypeForm.get('amenities')?.setValue(response.amenities[0])
          if (this.outlets.length > 0) {
            this.setOutlet(response.outletid);
          } else {
            // If outlets are not loaded yet, subscribe to the loadOutlets method
            this.loadOutlets();
            this.filteredOutlets$.subscribe(() => {
              this.setOutlet(response.outletid);
            });
          }
        
        }
      }
    );
  }

  setOutlet(outletid: number) {
    // Find the outlet with the corresponding outletid and set the OutletName
    const selectedOutlet = this.outlets.find(outlet => outlet.outletid === outletid);
    if (selectedOutlet) {
      this.roomTypeForm.get('OutletName')?.setValue(selectedOutlet.name);
    }
  }
  
  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1//room-type/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      }
    );
  }
}
