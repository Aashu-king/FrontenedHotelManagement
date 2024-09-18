import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

interface SidebarItem {
  label: string;
  routerLink: string;
  strokeIcon: string;
  fillIcon: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  childNavOpen: boolean = false;
  Isadmin : boolean = true;
  isSidebarOpen: boolean = false;
  scrollbarVisible: boolean = false;
  searchText: string = '';

  sidebarItems: any[]  = [];


filteredSidebarItems: SidebarItem[] = [...this.sidebarItems]; 

routerMo : any;
searchArray : any[] = []
openModuleTypeIndex: number | null = null;
openModuleNameIndex: number | null = null;

toggleModuleType(index: number) {
  this.openModuleTypeIndex = this.openModuleTypeIndex === index ? null : index;
  this.openModuleNameIndex = null;
}

toggleModuleName(moduleTypeIndex: number, moduleIndex: number) {
  this.openModuleNameIndex = (this.openModuleTypeIndex === moduleTypeIndex && this.openModuleNameIndex === moduleIndex) ? null : moduleIndex;
}

serachForm !: FormGroup
  constructor(public router: Router,private fb : FormBuilder,private ngZone: NgZone, private cdRef: ChangeDetectorRef,private http : HttpClient) {
    this.routerMo = router.url
    console.log('this.routerMo: ', this.routerMo);
   }


  ngOnInit() {
    this.filteredSidebarItems = this.sidebarItems;
    this.serachForm = this.fb.group({
      searchValue : []
    });
    this.serachForm.get('searchValue')?.valueChanges.subscribe(value => this.searchFunction(value));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('/').pop();
      }
    });

    this.getSidebarData()
  }
  
  toggleChildNav() {
    this.childNavOpen = !this.childNavOpen;
  }

    searchFunction(value: string){
      if (value) {
        this.filteredSidebarItems = this.sidebarItems.filter(item =>
          item.label.toLowerCase().includes(value.toLowerCase())
        );
       
      } else {
        this.filteredSidebarItems = [...this.sidebarItems];
      }
    }

    hideScrollbar(): void {
      this.ngZone.run(() => {
        this.scrollbarVisible = !this.scrollbarVisible;
        this.cdRef.detectChanges();
      });
    }
   
    toggleHeaderClass() {
       this.isSidebarOpen = !this.isSidebarOpen;
    }

    getSidebarData(){
      this.http.get('http://localhost:3000/api/v1/getPerm').subscribe((result : any) => {
        console.log("🚀 ~ SidebarComponent ~ this.http.get ~ result:", result)
        if(result){
          this.sidebarItems = result.moduleTypeData

        }
        
      })
    }
}
