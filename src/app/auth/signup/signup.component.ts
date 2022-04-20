import { AuthService } from './../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;
  constructor( public auth : AuthService) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) { 
    if (form.invalid)
      return;
    let value = form.value;
    this.auth.createUser(value.email, value.password);
  }
}
