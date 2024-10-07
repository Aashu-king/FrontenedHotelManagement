import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrl: './user-permission.component.css'
})
export class UserPermissionComponent {
  userPermissionForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  dataArray : any
isUpdateMode: any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<UserPermissionComponent>, private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.userPermissionForm = this.fb.group({
      userId: [''],
      pageId: [''],
      canView: [false],
      canEdit: [false],
      canDelete: [false],
    });

    if(this.data && this.data.userId && this.data.pageId){
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
  }

  onSubmit() {
    if(!this.data){
      if (this.userPermissionForm.valid) {
        console.log("🚀 ~ UserPermissionComponent ~ onSubmit ~ this.userPermissionForm.valid:", this.userPermissionForm.valid)
        console.log(this.userPermissionForm.value);
        this.http.post('http://localhost:3000/api/v1/userwisePermission', this.userPermissionForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      this.http.put('http://localhost:3000/api/v1/upuserpermission', this.userPermissionForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
   
  }

  onDelete(){
    const params = new HttpParams()
    .set('userId', this.data.userId)
    .set('pageId', this.data.pageId);
    this.http.delete(`http://localhost:3000/api/v1/user-permission`,{params}).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      },
      (error) => {
        console.error('Error saving module:', error);
      }
    );
  }

  getByIdData(){
    const params = new HttpParams()
    .set('userId', this.data.userId)
    .set('pageId', this.data.pageId);

  this.http.get(`http://localhost:3000/api/v1/user-permission`, { params }).subscribe((result: any) => {
    this.dataArray = result;
    console.log("🚀 ~ getByIdData ~ result:", this.dataArray);

    if (this.dataArray) {
      this.userPermissionForm.get('canView')?.setValue(this.dataArray.canView);
      this.userPermissionForm.get('canEdit')?.setValue(this.dataArray.canEdit);
      this.userPermissionForm.get('canDelete')?.setValue(this.dataArray.canDelete);
    }
  });
  }
}
