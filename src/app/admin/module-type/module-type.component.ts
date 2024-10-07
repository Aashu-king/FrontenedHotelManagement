import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module-type',
  templateUrl: './module-type.component.html',
  styleUrl: './module-type.component.css'
})
export class ModuleTypeComponent {
  moduleTypeForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  dataArray : any;
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ModuleTypeComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private http : HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.moduleTypeForm = this.fb.group({
      moduleTypeId: [{ value: '', disabled: true }], 
      moduleTypeName: ['', [Validators.required, Validators.maxLength(100)]],
    });

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

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/module-type/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        this.moduleTypeForm.get('moduleTypeName')?.setValue(this.dataArray.moduleTypeName)
      }

    })
  }

  onSubmit() {
    if(!this.data){
      if (this.moduleTypeForm.valid) {
        console.log(this.moduleTypeForm.value);
        this.http.post('http://localhost:3000/api/v1/moduletype', this.moduleTypeForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.moduleTypeForm.valid) {
        console.log(this.moduleTypeForm.value);
        this.http.put(`http://localhost:3000/api/v1/module-type/${this.data}`, this.moduleTypeForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }

  }

  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/module-type/${this.data}`).subscribe(
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
