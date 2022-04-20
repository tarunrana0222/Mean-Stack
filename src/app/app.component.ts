import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import { post } from './posts/post.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  constructor (public auth : AuthService) {}
  title = 'Mean Stack';
  ngOnInit(): void {
    this.auth.autoAuthUser();
  }
}


