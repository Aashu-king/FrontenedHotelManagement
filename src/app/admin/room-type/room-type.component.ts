import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrl: './room-type.component.css'
})
export class RoomTypeComponent {
  roomTypeForm !: FormGroup;
  amenitiesList = ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar'];
  outlets : any;
  SaveUpdateEvent: boolean = false;
isUpdateMode: any;
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
      outletid: ['']
    });

    this.getDropdown()
    if(this.data){
      this.getById()
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
          const filteredData = this.outlets.find((ele : any) => ele.outletid == response.outletid)
          this.roomTypeForm.get('outletid')?.setValue(filteredData.outletid)
          this.roomTypeForm.get('amenities')?.setValue(response.amenities[0])
        }
      }
    );
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
