import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent {
  moduleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
    
    }
  }
}
