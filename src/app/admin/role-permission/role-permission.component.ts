import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.css'
})
export class RolePermissionComponent {
  rolePermissionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.rolePermissionForm = this.fb.group({
      roleId: [''],
      pageId: [''],
      canView: [false],
      canEdit: [false],
      canDelete: [false],
    });
  }

  onSubmit() {
    if (this.rolePermissionForm.valid) {
      console.log(this.rolePermissionForm.value);
    
    }
  }
}
