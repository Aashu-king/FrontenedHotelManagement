import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']  // Corrected to styleUrls
})
export class PageComponent implements OnInit {
  pageForm!: FormGroup;
  SaveUpdateEvent: boolean = false;
  moduleTypeOptions: any[] = [];  // Array to hold module options
  filteredModuleTypes!: Observable<any[]>; // Initialized without of([])

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<PageComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      pageId: [{ value: '', disabled: true }],
      moduleId: [''],
      moduleName : [''],
      pageName: ['', [Validators.required, Validators.maxLength(255)]],
      pageUrl: ['', [Validators.maxLength(255)]],
    });

    this.loadModuleTypeOptions();
    
    // Initialize filteredModuleTypes
    this.filteredModuleTypes = this.pageForm.get('moduleName')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''), // Ensure value is a string
      map(value => this._filterModuleTypes(value))
    );
  }

  private loadModuleTypeOptions(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-modules').subscribe((result: any) => {
      this.moduleTypeOptions = result;
      console.log("🚀 ~ PageComponent ~ loadModuleTypeOptions ~ moduleTypeOptions:", this.moduleTypeOptions);
    });
  }

  onSubmit() {
    if (this.pageForm.valid) {
      console.log(this.pageForm.value);
      this.http.post('http://localhost:3000/api/v1/page', this.pageForm.value).subscribe(
        (response: any) => {
          console.log('Success!', response);
          this.dialogRef.close(true);  
        }
      );
    }
  }

  private _filterModuleTypes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.moduleTypeOptions.filter(option => option.moduleName.toLowerCase().includes(filterValue));
  }

  onModuleSelected(event: any) {
    const selectedModule = this.moduleTypeOptions.find(module => module.moduleName === event.option.value);
    if (selectedModule) {
      // Set the module ID to the form control
      this.pageForm.get('moduleId')!.setValue(selectedModule.moduleId);
      
      // Set the displayed value (moduleName) to the moduleId input
      this.pageForm.get('moduleName')!.setValue(selectedModule.moduleName);
    }
  }
}
