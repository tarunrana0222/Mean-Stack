import { Subscription } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authSub!: Subscription;
  userIsAuthenticated: boolean = false;
  constructor(public auth : AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.auth.getIsAuth();
    this.authSub = this.auth.getAuthStatusListner().subscribe(isAuth => { 
      this.userIsAuthenticated = isAuth;
    })
  }
 
  onLogout() { 
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
