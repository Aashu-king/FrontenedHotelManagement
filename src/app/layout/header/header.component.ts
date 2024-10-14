import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showSidebar: boolean = true;
  constructor (private router: Router) {

  }
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  logout(): void{
    delete localStorage['token'];
    delete localStorage['email'];
    delete localStorage['isFirstLoad'];
    delete localStorage['userid'];
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
}
