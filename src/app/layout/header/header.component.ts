import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showSidebar: boolean = true;
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
}
