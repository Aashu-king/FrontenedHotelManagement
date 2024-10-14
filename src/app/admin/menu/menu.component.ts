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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<MenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuForm = this.fb.group({
      item_name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      description: ['']
    });

    if (data?.menu_item_id) {
      this.loadMenuItem(data.menu_item_id);
    }
  }

  loadMenuItem(menuItemId: number) {
    this.http.get(`http://localhost:3000/api/v1/menu/${menuItemId}`).subscribe((result: any) => {
      this.menuForm.patchValue(result);
    });
  }

  saveMenuItem() {
    if (this.menuForm.valid) {
      const menuData = this.menuForm.value;
      if (this.data?.menu_item_id) {
        this.http.put(`http://localhost:3000/api/v1/menu/${this.data.menu_item_id}`, menuData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.http.post('http://localhost:3000/api/v1/menu', menuData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
