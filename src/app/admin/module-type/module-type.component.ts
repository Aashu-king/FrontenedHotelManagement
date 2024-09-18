import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-module-type',
  templateUrl: './module-type.component.html',
  styleUrl: './module-type.component.css'
})
export class ModuleTypeComponent {
  moduleTypeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.moduleTypeForm = this.fb.group({
      moduleTypeId: [{ value: '', disabled: true }], 
      moduleTypeName: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    if (this.moduleTypeForm.valid) {
      console.log(this.moduleTypeForm.value);
    
    }
  }
}
