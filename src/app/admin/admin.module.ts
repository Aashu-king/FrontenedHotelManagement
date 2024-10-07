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
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoomComponent } from './room/room.component';
import { RoomRateComponent } from './room-rate/room-rate.component';
import { RoomTypeComponent } from './room-type/room-type.component';
import { GuestComponent } from './guest/guest.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomRateListComponent } from './room-rate/room-rate-list/room-rate-list.component';
import { RoomTypeListComponent } from './room-type/room-type-list/room-type-list.component';
import { GuestListComponent } from './guest/guest-list/guest-list.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { RolePermissionListComponent } from './role-permission/role-permission-list/role-permission-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserPermissionListComponent } from './user-permission/user-permission-list/user-permission-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PageListComponent } from './page/page-list/page-list.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { BillComponent } from './bill/bill.component';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BillListComponent } from './bill/bill-list/bill-list.component';
import { BillDetailListComponent } from './bill-detail/bill-detail-list/bill-detail-list.component';
import { CheckinListComponent } from './checkin/checkin-list/checkin-list.component';
import { CheckoutListComponent } from './checkout/checkout-list/checkout-list.component';

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
    RoomComponent,
    RoomRateComponent,
    GuestComponent,
    ReservationComponent,
    RoomListComponent,
    RoomRateListComponent,
    RoomTypeListComponent,
    GuestListComponent,
    ReservationListComponent,
    RolePermissionListComponent,
    UserListComponent,
    UserPermissionComponent,
    UserPermissionListComponent,
    PageComponent,
    PageListComponent,
    BillDetailComponent,
    BillComponent,
    CheckinComponent,
    CheckoutComponent,
    BillListComponent,
    BillDetailListComponent,
    CheckinListComponent,
    CheckoutListComponent,
    RoomTypeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ]
})
export class AdminModule { }
//https://github.com/Aashu-king/hotelmanagement_user.git  git@github.com:Aashu-king/hotelmanagement_user.git


//git clone https://Aashu-king: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@@github.com:Aashu-king/hotelmanagement_user.git


//git remote set-url origin https://Aashu-king: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@@github.com:Aashu-king/hotelmanagement_user.git
