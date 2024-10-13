import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, startWith } from 'rxjs';

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
  UserOptions: any[] = []; 
  PageOptions: any[] = []; 
  filteredUserTypes$: Observable<any[]> = of([]); 
  filteredPageTypes$: Observable<any[]> = of([]); 
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<UserPermissionComponent>, private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.userPermissionForm = this.fb.group({
      userId: [''],
      pageId: [''],
      userName: [''],
      pageName: [''],
      canView: [false],
      canEdit: [false],
      canDelete: [false],
    });

    if(this.data && this.data.userId && this.data.pageId){
      console.log("🚀 ~ UserTypes ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
    this.loadModuleTypeOptions();
    this.setupAutoComplete();
    this.setupAutoCompletePage();
  }

  private loadModuleTypeOptions(): void {
    // Fetch user options
    this.http.get('http://localhost:3000/api/v1/dropdown-users').subscribe((result: any) => {
      this.UserOptions = result;
      console.log("🚀 ~ UserOptions:", this.UserOptions);
  
      // After loading user options, get the data by ID and set the form
      this.getByIdData();  // Call this AFTER options are loaded
    });
  
    // Fetch page options
    this.http.get('http://localhost:3000/api/v1/dropdown-pages').subscribe((result: any) => {
      this.PageOptions = result;
      console.log("🚀 ~ PageOptions:", this.PageOptions);
    });
  }

  private setupAutoComplete(): void {
    this.filteredUserTypes$ = this.userPermissionForm.get('userName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterUserTypes(value || ''))
    );
  }

  private setupAutoCompletePage(): void {
    this.filteredPageTypes$ = this.userPermissionForm.get('pageName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterPageTypes(value || ''))
    );
  }

  private filterUserTypes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.UserOptions.filter((option: any) => 
      option.userName.toLowerCase().includes(filterValue)
    );
  }

  private filterPageTypes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.PageOptions.filter((option: any) => 
      option.pageName.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelectedPage(event: any): void {
    const selectedPageType = this.PageOptions.find((type: any) => type.pageName === event.option.value);
    if (selectedPageType) {
      this.userPermissionForm.get('pageId')?.setValue(selectedPageType.pageId);
      this.userPermissionForm.get('pageName')?.setValue(selectedPageType.pageName);
    }
  }

  onOptionSelected(event: any): void {
    const selectedUserType = this.UserOptions.find((type: any) => type.userName === event.option.value);
    if (selectedUserType) {
      this.userPermissionForm.get('userId')?.setValue(selectedUserType.userId);
      this.userPermissionForm.get('userName')?.setValue(selectedUserType.userName);
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
     // Find and set the userName based on userId
     const selectedUserType = this.UserOptions.find((type: any) => type.userId === this.dataArray.userId);
     if (selectedUserType) {
       this.userPermissionForm.get('userName')?.setValue(selectedUserType.userName);
       // Set the filtered list to include the selected user
       this.filteredUserTypes$ = of([selectedUserType]);
     }

     // Find and set the pageName based on pageId
     const selectedPageType = this.PageOptions.find((type: any) => type.pageId === this.dataArray.pageId);
     if (selectedPageType) {
       this.userPermissionForm.get('pageName')?.setValue(selectedPageType.pageName);
       // Set the filtered list to include the selected page
       this.filteredPageTypes$ = of([selectedPageType]);
     }
    }
  });
  }
}
