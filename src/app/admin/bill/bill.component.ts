import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent {
  billForm!: FormGroup;
  moduleTypeOptions: any[] = [];  // Array to hold module options
  filteredModuleTypes!: Observable<any[]>; // Initialized without of([])
  permissionArray : any 
  pageurl : any;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<BillComponent>,private http: HttpClient,private router : Router) {}

  ngOnInit(): void {
    this.billForm = this.fb.group({
      billId: [{ value: '', disabled: true }],
      guestId: ['', [Validators.required]],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      paymentMethod: ['', [Validators.required]],
      status: ['', [Validators.required]],
      outletid: ['', [Validators.required]],
    });

    this.pageurl =  this.router.url.split('/')[2]
    console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl:", this.pageurl)
    // console.log("🚀 ~ HotelListComponent ~ ngOnInit ~ this.pageurl.split('/'):", this.pageurl.split('/'))

    this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
      this.permissionArray = result.Permissions.find((ele : any) => ele.page.pageUrl == `/${this.pageurl}`)
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.permissionArray)
    })

    this.loadModuleTypeOptions();

    this.filteredModuleTypes = this.billForm.get('moduleName')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''), // Ensure value is a string
      map(value => this._filterModuleTypes(value))
    );
  }

  private loadModuleTypeOptions(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe((result: any) => {
      this.moduleTypeOptions = result;
      console.log("🚀 ~ PageComponent ~ loadModuleTypeOptions ~ moduleTypeOptions:", this.moduleTypeOptions);
    });
  }

  private _filterModuleTypes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.moduleTypeOptions.filter(option => option.moduleName.toLowerCase().includes(filterValue));
  }

  onModuleSelected(event: any) {
    const selectedModule = this.moduleTypeOptions.find(module => module.moduleName === event.option.value);
    if (selectedModule) {
      this.billForm.get('moduleId')!.setValue(selectedModule.moduleId);
      this.billForm.get('moduleName')!.setValue(selectedModule.moduleName);
    }
  }

  onSubmit() {
    if (this.billForm.valid) {
      console.log(this.billForm.value);
      this.http.post('http://localhost:3000/api/v1/hotels', this.billForm.value).subscribe(
        (response : any) => {
          console.log('Success!', response);
        }
      );
    }
  }
}
