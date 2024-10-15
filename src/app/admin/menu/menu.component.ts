import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuForm: FormGroup;
  dataArray : any

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<MenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuForm = this.fb.group({
      outletid: [''],
      item_name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      description: ['']
    });
    if (data?.menu_item_id) {
    
      
      this.getByIdData()
    }
  }

  // loadMenuItem(menuItemId: number) {
  //   this.http.get(`http://localhost:3000/api/v1/menu/${menuItemId}`).subscribe((result: any) => {
  //     this.menuForm.patchValue(result);
  //   });
  // }

  saveMenuItem() {
    if(!this.data){
      if (this.menuForm.valid) {
        this.http.post('http://localhost:3000/api/v1/menus', this.menuForm.value).subscribe(
          (response : any) => {
            console.log('this.menuForm.value', this.menuForm.value);
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.menuForm.valid) {
        console.log(this.menuForm.value);
        this.http.put(`http://localhost:3000/api/v1/menu/${this.data.menu_item_id}`, this.menuForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/menus/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){

       
      
        this.menuForm.get('item_name')?.setValue(this.dataArray.item_name)
     
        this.menuForm.get('price')?.setValue(this.dataArray.price)
        this.menuForm.get('category')?.setValue(this.dataArray.category)
        this.menuForm.get('description')?.setValue(this.dataArray.description)


       
        // if (this.outlets.length > 0) {
        //   this.setOutlet(this.dataArray.outletid);
        // } else {
      
        //   this.loadOutlets();
        //   this.filteredOutlets$.subscribe(() => {
        //     this.setOutlet(this.dataArray.outletid);
        //   });
        // }
      }

    })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
