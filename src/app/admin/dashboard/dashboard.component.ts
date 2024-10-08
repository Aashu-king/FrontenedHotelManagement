import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedTab: string = 'table1'; // Default selected tab

  // Method to select a tab
  selectTab(tabId: string) {
    this.selectedTab = tabId; // Update the selected tab
  }
}
