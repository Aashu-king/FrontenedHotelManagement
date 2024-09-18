import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layout/full/full.component';
import { BlankComponent } from './layout/blank/blank.component';

const routes: Routes = [

  {path: '' , redirectTo: 'login', pathMatch:'full'},
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule)
      }
    ]
  },
  {
    path : '',
    component : BlankComponent,
    children : [
      {
        path : 'login',
        loadChildren : () => import('./authentication/authentication.module').then(x => x.AuthenticationModule)
      },  
  ]
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
