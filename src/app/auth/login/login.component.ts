import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  constructor(public auth:AuthService) { }

  ngOnInit(): void {
  }
  onLogin(form: NgForm) { 
    if (form.invalid)
      return;
    let value = form.value;
    this.auth.login(value.email, value.password);
  }

}
