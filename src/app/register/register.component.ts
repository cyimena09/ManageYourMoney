import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from '../models/user';
import {UserService} from '../services/user/user.service';
import {OngletService} from '../services/onglet/onglet.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registred: boolean = false;
  invalidEmail: boolean = false;
  invalidLenght: boolean = false;
  unmachtedPassword: boolean = false;

  constructor(private userService: UserService, private ongletService: OngletService) { }

  ngOnInit(): void {
    this.ongletService.ongletSubject.next(true)
  }

  onRegistration(form: NgForm){
    this.invalidEmail = false;
    this.invalidLenght = false;
    this.unmachtedPassword = false;
    const firstName = form.value['firstName'];
    const lastName = form.value['lastName'];
    const email = form.value['email'];
    const password = form.value['password'];
    const confirmpassword = form.value['confirmpassword'];
    if(password.length < 7){
      const focuspassword = document.getElementById("password");
      focuspassword.style.border = 'solid red'
      focuspassword.focus();
      return  this.invalidLenght = true;
    }
    if(password != confirmpassword){
      const focuspassword = document.getElementById("password");
      focuspassword.style.border = 'solid red'
      const focusconfirmpassword = document.getElementById("confirmpassword")
      focusconfirmpassword.style.border = 'solid red'
      focusconfirmpassword.focus();
      return this.unmachtedPassword = true;
    }
    const newUser = new User();
    newUser.FirstName = firstName;
    newUser.LastName = lastName;
    newUser.Email = email;
    newUser.Password = password;
    this.userService.createUser(newUser).subscribe(
      () => {this.ongletService.ongletSubject.next(false); this.registred = true},
      () => {this.invalidEmail = true}
    );
  }
}
