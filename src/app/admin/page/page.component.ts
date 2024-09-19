import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  pageForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<PageComponent>,private http: HttpClient) {}

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      pageId: [{ value: '', disabled: true }], 
      moduleId: [''], 
      pageName: ['', [Validators.required, Validators.maxLength(255)]],
      pageUrl: ['', [Validators.maxLength(255)]], 
    });
  }

  onSubmit() {
    if (this.pageForm.valid) {
      console.log(this.pageForm.value);
      this.http.post('http://localhost:3000/api/v1/page', this.pageForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
