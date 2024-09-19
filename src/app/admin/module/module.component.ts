import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent {
  moduleForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ModuleComponent>, private http: HttpClient ) {}

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      moduleId: [{ value: '', disabled: true }], 
      moduleTypeId: [''], 
      moduleName: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    if (this.moduleForm.valid) {
      console.log(this.moduleForm.value);
      this.http.post('http://localhost:3000/api/v1/module', this.moduleForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
