import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  menuForm: FormGroup;
  dataArray : any
  OutletTypeOptions: any[] = [];  
  outlets: any[] = [];
  MenuDropdown: any = [];
   filteredOutlets$: Observable<any[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<MenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuForm = this.fb.group({
      outletid: [''],
      item_name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      OutletName: ['']
    });
    if (data?.menu_item_id) {
    
      
      this.getByIdData()
    }
  }
  
  ngOnInit(): void {
    this.loadOutlets();
    this.setupOutletAutoComplete();
  }

  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe((result: any) => {
      this.outlets  = result;
      console.log("🚀 ~ ModuleComponent ~ this.httpClient.get ~ moduleTypeOptions:", this.OutletTypeOptions);

      if (this.MenuDropdown) {
        this.setOutlet(this.MenuDropdown.outletid);
      }
    });

    
  }

  private setupOutletAutoComplete(): void {
    this.filteredOutlets$ = this.menuForm.get('OutletName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterOutlets(value || ''))
    );
  }

  private filterOutlets(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.outlets.filter((option: any) => 
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedOutlet  = this.outlets.find((type: any) => type.name === event.option.value);
    if (selectedOutlet ) {
      this.menuForm.get('outletid')?.setValue(selectedOutlet .outletid);
    }
  }

  // loadMenuItem(menuItemId: number) {
  //   this.http.get(`http://localhost:3000/api/v1/menu/${menuItemId}`).subscribe((result: any) => {
  //     this.menuForm.patchValue(result);
  //   });
  // }

  saveMenuItem() {
    if(!this.data){
      if (this.menuForm.valid) {
        this.http.post('http://localhost:3000/api/v1/menus', this.menuForm.value).subscribe(
          (response : any) => {
            console.log('this.menuForm.value', this.menuForm.value);
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.menuForm.valid) {
        console.log(this.menuForm.value);
        this.http.put(`http://localhost:3000/api/v1/menu/${this.data.menu_item_id}`, this.menuForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  }

  getByIdData(){
    this.http.get(`http://localhost:3000/api/v1/menus/${this.data.menu_item_id}`).subscribe((result : any) => {
      this.MenuDropdown = result
      console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this:",this.MenuDropdown)
      if(this.MenuDropdown){

       
      
        this.menuForm.get('item_name')?.setValue(this.MenuDropdown.item_name)
     
        this.menuForm.get('price')?.setValue(this.MenuDropdown.price)
        this.menuForm.get('category')?.setValue(this.MenuDropdown.category)
        this.menuForm.get('description')?.setValue(this.MenuDropdown.description)


       
        if (this.outlets.length > 0) {
          this.setOutlet(this.MenuDropdown.outletid);
        } else {
      
          this.loadOutlets();
          this.filteredOutlets$.subscribe(() => {
            this.setOutlet(this.MenuDropdown.outletid);
          });
        }
      }

    })
  }

  setOutlet(outletid: number) {
    // Find the outlet with the corresponding outletid and set the OutletName
    const selectedOutlet = this.outlets.find(outlet => outlet.outletid === outletid);
    if (selectedOutlet) {
      this.menuForm.get('OutletName')?.setValue(selectedOutlet.name);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
