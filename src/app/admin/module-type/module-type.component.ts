import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-module-type',
  templateUrl: './module-type.component.html',
  styleUrl: './module-type.component.css'
})
export class ModuleTypeComponent {
  moduleTypeForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ModuleTypeComponent>,private http: HttpClient) {}

  ngOnInit(): void {
    this.moduleTypeForm = this.fb.group({
      moduleTypeId: [{ value: '', disabled: true }], 
      moduleTypeName: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    if (this.moduleTypeForm.valid) {
      console.log(this.moduleTypeForm.value);
      this.http.post('http://localhost:3000/api/v1/moduletype', this.moduleTypeForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
