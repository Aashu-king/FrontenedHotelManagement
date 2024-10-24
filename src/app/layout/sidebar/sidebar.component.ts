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

interface PageData {
  pageName: string;
  pageUrl: string;
}

interface ModuleData {
  moduleName: string;
  pageData: PageData[];
}

interface ModuleType {
  moduleTypeName: string;
  moduleData: ModuleData[];
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

  openModuleTypes: boolean[] = [];
  openModuleNames: { [key: number]: boolean[] } = {};


filteredSidebarItems: any[] = [...this.sidebarItems]; 

routerMo : any;
searchArray : any[] = []
openModuleTypeIndex: number = -1;
openModuleNameIndex: number = -1;

// toggleModuleType(index: number) {
//   this.openModuleTypeIndex = this.openModuleTypeIndex === index ? null : index;
//   this.openModuleNameIndex = null;
// }

// toggleModuleName(moduleTypeIndex: number, moduleIndex: number) {
//   this.openModuleNameIndex = (this.openModuleTypeIndex === moduleTypeIndex && this.openModuleNameIndex === moduleIndex) ? null : moduleIndex;
// }

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

  toggleModuleType(index: number) {
    if (this.openModuleTypeIndex === index) {
      this.openModuleTypeIndex = -1;
      this.openModuleNameIndex = -1;  
    } else {
      this.openModuleTypeIndex = index;
      this.openModuleNameIndex = -1;  
    }
  }

  toggleModuleName(moduleTypeIndex: number, moduleIndex: number) {
    if (this.openModuleTypeIndex === moduleTypeIndex) {
      if (this.openModuleNameIndex === moduleIndex) {
        this.openModuleNameIndex = -1;
      } else {
        this.openModuleNameIndex = moduleIndex;
      }
    }
  }

  searchFunction(value: string) {
    if (value) {
      const searchTerm = value.toLowerCase();
      
      this.filteredSidebarItems = this.sidebarItems.map(moduleType => {
        const filteredModuleType = { ...moduleType };
        
        filteredModuleType.moduleData = moduleType.moduleData.map((module : any) => {
          const filteredModule = { ...module };
          
          filteredModule.pageData = module.pageData.filter((page : any) => 
            page.pageName.toLowerCase().includes(searchTerm)
          );
          
          return filteredModule;
        }).filter((module : any) => 
          module.moduleName.toLowerCase().includes(searchTerm) || 
          module.pageData.length > 0
        );
        
        return filteredModuleType;
      }).filter(moduleType => 
        moduleType.moduleTypeName.toLowerCase().includes(searchTerm) || 
        moduleType.moduleData.length > 0
      );

      if (this.filteredSidebarItems.length > 0) {
        this.openModuleTypeIndex = 0;
        if (this.filteredSidebarItems[0].moduleData.length > 0) {
          this.openModuleNameIndex = 0;
        }
      }
    } else {
      this.filteredSidebarItems = [...this.sidebarItems];
      this.openModuleTypeIndex = -1;
      this.openModuleNameIndex = -1;
    }
  }


  private hasMatchingChildren(moduleType: any, searchTerm: string): boolean {
    return moduleType.moduleData.some((module : any) => 
      module.moduleName.toLowerCase().includes(searchTerm) ||
      module.pageData.some((page : any) => 
        page.pageName.toLowerCase().includes(searchTerm)
      )
    );
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
          this.filteredSidebarItems = [...this.sidebarItems];
        }
        
      })
    }
}
