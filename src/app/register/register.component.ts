import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from '../models/user';
import {UserService} from '../services/user/user.service';

import {Subject} from 'rxjs';
import {RegisterService} from '../services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registred = false;

  constructor(private userService: UserService, private registerService: RegisterService) { }

  ngOnInit(): void {
    this.registerService.inscriptionSubject.next(true)

  }

  onRegistration(form: NgForm){
    const firstName = form.value['firstName'];
    const lastName = form.value['lastName'];
    const email = form.value['email'];
    const password = form.value['password'];
    const newUser = new User(firstName, lastName, email, password);
    this.userService.createUser(newUser).subscribe(
      () => {this.registerService.inscriptionSubject.next(false); this.registred=true}
    );
  }
}
