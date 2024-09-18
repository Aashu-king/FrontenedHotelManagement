import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrl: './user-permission.component.css'
})
export class UserPermissionComponent {
  userPermissionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userPermissionForm = this.fb.group({
      userId: [''],
      pageId: [''],
      canView: [false],
      canEdit: [false],
      canDelete: [false],
    });
  }

  onSubmit() {
    if (this.userPermissionForm.valid) {
      console.log(this.userPermissionForm.value);
     
    }
  }
}
