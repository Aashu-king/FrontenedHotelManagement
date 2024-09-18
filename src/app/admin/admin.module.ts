import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelComponent } from './hotel/hotel.component';
import { ModuleTypeComponent } from './module-type/module-type.component';
import { ModuleComponent } from './module/module.component';
import { OutletComponent } from './outlet/outlet.component';
import { PageComponent } from './page/page.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { RoleComponent } from './role/role.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { UserComponent } from './user/user.component';
import { HotelListComponent } from './hotel/hotel-list/hotel-list.component';
import { ModuleListComponent } from './module/module-list/module-list.component';
import { ModuleTypeListComponent } from './module-type/module-type-list/module-type-list.component';
import { OutletListComponent } from './outlet/outlet-list/outlet-list.component';



@NgModule({
  declarations: [
    HotelComponent,
    ModuleTypeComponent,
    ModuleComponent,
    OutletComponent,
    PageComponent,
    RolePermissionComponent,
    RoleComponent,
    UserPermissionComponent,
    UserComponent,
    HotelListComponent,
    ModuleListComponent,
    ModuleTypeListComponent,
    OutletListComponent,
  
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    
  ]
})
export class AdminModule { }
