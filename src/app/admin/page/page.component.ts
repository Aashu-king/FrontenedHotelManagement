import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  dataArray : any;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<PageComponent>, private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: any) {}

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

    if(this.data){
      console.log("🚀 ~ ModuleComponent ~ ngOnInit ~ this.data:", this.data)
      this.getByIdData();
    }
  }

  private loadModuleTypeOptions(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-modules').subscribe((result: any) => {
      this.moduleTypeOptions = result;
      console.log("🚀 ~ PageComponent ~ loadModuleTypeOptions ~ moduleTypeOptions:", this.moduleTypeOptions);
    });
  }

  onSubmit() {

    if(!this.data){
      if (this.pageForm.valid) {
        console.log(this.pageForm.value);
        this.http.post('http://localhost:3000/api/v1/page', this.pageForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.pageForm.valid) {
        console.log(this.pageForm.value);
        this.http.put(`http://localhost:3000/api/v1/page/${this.data}`, this.pageForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  }

  private _filterModuleTypes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.moduleTypeOptions.filter(option => option.moduleName.toLowerCase().includes(filterValue));
  }

  onModuleSelected(event: any) {
    const selectedModule = this.moduleTypeOptions.find(module => module.moduleName === event.option.value);
    if (selectedModule) {
      this.pageForm.get('moduleId')!.setValue(selectedModule.moduleId);
      this.pageForm.get('moduleName')!.setValue(selectedModule.moduleName);
    }
  }



  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/page/${this.data}`).subscribe((result : any) => {
      this.dataArray = result.data
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.dataArray)
      if(this.dataArray){
        this.pageForm.get('pageName')?.setValue(this.dataArray.pageName)
        this.pageForm.get('pageUrl')?.setValue(this.dataArray.pageUrl)
        const selectedModule = this.moduleTypeOptions.find(module => module.moduleId === this.dataArray.moduleId);
        if (selectedModule) {
          this.pageForm.get('moduleId')!.setValue(selectedModule.moduleId);
          this.pageForm.get('moduleName')!.setValue(selectedModule.moduleName);
        }
      }

    })
  }



  onDelete(){
    this.http.delete(`http://localhost:3000/api/v1/page/${this.data}`).subscribe(
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
