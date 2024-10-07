import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  dataArray : any

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModuleComponent>,
    private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,private http : HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadModuleTypeOptions();
    this.setupAutoComplete();
    if(this.data){
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
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
    this.filteredModuleTypes$ = this.moduleForm.get('moduleName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterModuleTypes(value || ''))
    );
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/module/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        this.moduleForm.get('moduleName')?.setValue(this.dataArray.moduleName)
        const selectedModuleType = this.moduleTypeOptions.find((type: any) => type.moduleTypeId === this.dataArray.moduleTypeId);
    if (selectedModuleType) {
      this.moduleForm.get('moduleTypeId')?.setValue(selectedModuleType.moduleTypeId);
    }
      }

    })
  }

  onSubmit(): void {
    if(!this.data){
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
    }else{
      if (this.moduleForm.valid) {
        console.log(this.moduleForm.value);
        console.log("🚀 ~ ModuleComponent ~ onSubmit ~ this.data:", this.data)
        this.httpClient.put(`http://localhost:3000/api/v1/module/${this.data}`, this.moduleForm.value).subscribe(
          (response: any) => {
            console.log('Success!', response);
            this.dialogRef.close(true); 
          },
          (error) => {
            console.error('Error saving module:', error);
          }
        );
      }
    }
    
  }

  onDelete(){
    this.httpClient.delete(`http://localhost:3000/api/v1/module/${this.data}`).subscribe(
      (response: any) => {
        console.log('Success!', response);
        this.dialogRef.close(true); 
      },
      (error) => {
        console.error('Error saving module:', error);
      }
    );
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
