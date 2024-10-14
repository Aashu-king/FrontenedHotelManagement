import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelComponent } from './hotel/hotel.component';
import { ModuleComponent } from './module/module.component';
import { ModuleTypeComponent } from './module-type/module-type.component';
import { OutletComponent } from './outlet/outlet.component';
import { PageComponent } from './page/page.component';
import { RoleComponent } from './role/role.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { UserComponent } from './user/user.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { HotelListComponent } from './hotel/hotel-list/hotel-list.component';
import { ModuleListComponent } from './module/module-list/module-list.component';
import { ModuleTypeListComponent } from './module-type/module-type-list/module-type-list.component';
import { OutletListComponent } from './outlet/outlet-list/outlet-list.component';
import { PageListComponent } from './page/page-list/page-list.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { RolePermissionListComponent } from './role-permission/role-permission-list/role-permission-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserPermissionListComponent } from './user-permission/user-permission-list/user-permission-list.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomTypeComponent } from './room-type/room-type.component';
import { RoomTypeListComponent } from './room-type/room-type-list/room-type-list.component';
import { BillListComponent } from './bill/bill-list/bill-list.component';
import { RoomRateListComponent } from './room-rate/room-rate-list/room-rate-list.component';
import { GuestListComponent } from './guest/guest-list/guest-list.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { CheckinListComponent } from './checkin/checkin-list/checkin-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { BillDetailListComponent } from './bill-detail/bill-detail-list/bill-detail-list.component';
import { TablesListComponent } from './table/tables-list/tables-list.component';
import { TablesResvationListComponent } from './table-resrvation/tables-resvation-list/tables-resvation-list.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderItemListComponent } from './order-items/order-item-list/order-item-list.component';
import { PaymentsListComponent } from './payments/payments-list/payments-list.component';
import { MenuComponent } from './menu/menu.component';
import { MenuListComponent } from './menu/menu-list/menu-list.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'hotel',
    pathMatch : 'full'
  },
  {
    path : '',
    children : [
      {
        path : 'hotel',
        component : HotelListComponent
      },
      {
        path : 'module',
        component : ModuleListComponent
      },
      {
        path : 'module-type',
        component : ModuleTypeListComponent
      },
      {
        path : 'outlet',
        component : OutletListComponent
      },
      {
        path : 'page',
        component : PageListComponent
      },
      {
        path : 'role',
        component : RoleListComponent
      },
      {
        path: 'role-permission',
        component: RolePermissionListComponent
      },
      {
        path: 'user',
        component: UserListComponent
      },
      {
        path: 'user-permission',
        component: UserPermissionListComponent
      },
      {
        path: 'room-type',
        component: RoomTypeListComponent
      },
      {
        path: 'room',
        component: RoomListComponent
      },
      {
        path: 'bill',
        component: BillListComponent
      },
      {
        path: 'room-rate',
        component: RoomRateListComponent
      },
      {
        path: 'room',
        component: RoomListComponent
      },
      {
        path: 'guest',
        component: GuestListComponent
      },
      {
        path: 'reservation',
        component: ReservationListComponent
      },
      {
        path: 'checkIn',
        component: CheckinListComponent
      },
      {
        path: 'admindashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path : 'bill-details',
        component : BillDetailListComponent
      },
      {
        path : 'table',
        component : TablesListComponent
      },
      {path : 'tablereservation',
        component : TablesResvationListComponent
      },
      {path : 'orders',
        component : OrderListComponent
      },
      {
        path : 'orderitems',
        component : OrderItemListComponent
      },
      {
        path : 'payments',
        component : PaymentsListComponent
      },
      {
        path : 'menu',
        component : MenuListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
