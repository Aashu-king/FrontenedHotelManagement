import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullComponent } from './full/full.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BlankComponent } from './blank/blank.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
      SidebarComponent,
      FullComponent,BlankComponent, HeaderComponent
  ],
  imports: [
    CommonModule,RouterModule,HttpClientModule,FormsModule ,ReactiveFormsModule
  ]
})
export class LayoutModule { }
