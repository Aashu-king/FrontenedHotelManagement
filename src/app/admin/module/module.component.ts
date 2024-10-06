import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'], 
})
export class ModuleComponent implements OnInit {
  moduleForm!: FormGroup;
  isUpdateMode: boolean = false; 
  moduleTypeOptions: any[] = []; 
  filteredModuleTypes$: Observable<any[]> = of([]); 

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModuleComponent>,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadModuleTypeOptions();
    this.setupAutoComplete();
  }

  private initializeForm(): void {
    this.moduleForm = this.formBuilder.group({
      moduleId: [{ value: '', disabled: true }],
      moduleTypeId: [''],
      moduleName: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  private loadModuleTypeOptions(): void {
    this.httpClient.get('http://localhost:3000/api/v1/dropdown-moduleType').subscribe((result: any) => {
      this.moduleTypeOptions = result;
      console.log("🚀 ~ ModuleComponent ~ this.httpClient.get ~ moduleTypeOptions:", this.moduleTypeOptions);
    });
  }

  private setupAutoComplete(): void {
    this.filteredModuleTypes$ = this.moduleForm.get('moduleName')!.valueChanges.pipe( // Using non-null assertion
      startWith(''),
      map(value => this.filterModuleTypes(value || ''))
    );
  }

  onSubmit(): void {
    if (this.moduleForm.valid) {
      console.log(this.moduleForm.value);
      this.httpClient.post('http://localhost:3000/api/v1/module', this.moduleForm.value).subscribe(
        (response: any) => {
          console.log('Success!', response);
          this.dialogRef.close(true); // Close the dialog on successful save
        },
        (error) => {
          console.error('Error saving module:', error);
        }
      );
    }
  }

  private filterModuleTypes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.moduleTypeOptions.filter((option: any) => 
      option.moduleTypeName.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedModuleType = this.moduleTypeOptions.find((type: any) => type.moduleTypeName === event.option.value);
    if (selectedModuleType) {
      this.moduleForm.get('moduleTypeId')?.setValue(selectedModuleType.moduleTypeId);
    }
  }
}
