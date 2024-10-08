import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedTab: string = 'table1';

  selectTab(tabId: string) {
    this.selectedTab = tabId; 
  }
}
