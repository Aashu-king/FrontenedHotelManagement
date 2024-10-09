import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {
  roomForm !: FormGroup;
  roomTypes : any
  SaveUpdateEvent: boolean = false;
  OutletTypeOptions: any[] = [];  
  outlets: any[] = [];
   filteredOutlets$: Observable<any[]> = of([]);
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RoomComponent>,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomId: [''],
      roomNumber: [''],
      roomTypeId: [''],
      floor: [''],
      status: ['available'],
      outletid: [''],
      OutletName: ['']
    });
    this.getDropdown()

    if(this.data){
      this.getData()
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
    this.filteredOutlets$ = this.roomForm.get('OutletName')!.valueChanges.pipe( 
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
      this.roomForm.get('outletid')?.setValue(selectedOutlet .outletid);
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
    this.http.get('http://localhost:3000/api/v1/dropdown-room-types').subscribe(
      (response : any) => {
        console.log('Success!', response);
        this.roomTypes = response
      }
    );
  }

  onSubmit() {
    if(!this.data){
      if (this.roomForm.valid) {
        console.log(this.roomForm.value);
        this.http.post('http://localhost:3000/api/v1/room', this.roomForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.roomForm.valid) {
        console.log(this.roomForm.value);
        this.http.put(`http://localhost:3000/api/v1/room/${this.data}`, this.roomForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
   
  }

  getData(){
    console.log("yi");
    
    this.http.get(`http://localhost:3000/api/v1/roomse/${this.data}`).subscribe(
      (response : any) => {
        console.log('Success!', response);
       if(response.data){
        this.roomForm.get('roomNumber')?.setValue(response.data.roomNumber)
        this.roomForm.get('floor')?.setValue(response.data.floor)
        const roomType = this.roomTypes.find((ele : any) => ele.roomTypeId == response.data.roomTypeId)
        this.roomForm.get('roomTypeId')?.setValue(roomType.roomTypeId)
        const outlet = this.outlets.find((ele : any) => ele.outletid == response.data.outletid)
        this.roomForm.get('outletid')?.setValue(outlet.outletid)
        this.roomForm.get('outletid')?.setValue(response.data.name)
        const selectedOutlet = this.outlets.find(outlet => outlet.outletid === response.data.outletid);
    if (selectedOutlet) {
      this.roomForm.get('OutletName')?.setValue(selectedOutlet.name);
    }
       }
       
      }
    );
  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/room/${this.data}`).subscribe(
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
