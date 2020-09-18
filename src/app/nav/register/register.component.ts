import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {slideTopBottomAnimation} from '../../models/animations/slideTopBottomAnimation';
import {UserService} from '../../services/user/user.service';
import {OngletService} from '../../services/onglet/onglet.service';
import {PersonalValidator} from '../../models/PersonalValidator';
import {User} from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [slideTopBottomAnimation],
  host: { '[@slideTopBottomAnimation]': '' }
})
export class RegisterComponent implements OnInit {

  loading = false;
  registerForm: FormGroup;
  registred: boolean = false;
  invalidEmail: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private ongletService: OngletService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.minLength(7)],
      confirmPassword: ['', Validators.required]
    }, {validator: PersonalValidator.MustMatch('password', 'confirmPassword')})
  }

  get f(){
    return this.registerForm.controls;
  }

  onRegistration(){
    this.loading = true
    const formValue = this.registerForm.value;
    const firstName = formValue['firstName'];
    const lastName = formValue['lastName'];
    const email = formValue['email'];
    const password = formValue['password'];

    const newUser = new User();
    newUser.FirstName = firstName;
    newUser.LastName = lastName;
    newUser.Email = email;
    newUser.Password = password;
    newUser.Registration = new Date();

    this.userService.createUser(newUser).subscribe(
      () => {this.registred = true; this.loading = false},
      () => {this.invalidEmail = true; this.loading = false}
      );
  }

}
