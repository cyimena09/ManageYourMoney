import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {OngletService} from '../services/onglet/onglet.service';
import {UserService} from '../services/user/user.service';
import {FormBuilder, NgForm, Validators} from '@angular/forms';
import {UserToUpdate} from '../models/userToUpdate';
import {User} from '../models/user';
import {PersonalValidator} from '../models/PersonalValidator';
import {fadeInAnimation} from '../models/animations/fadeAnimation';

@Component({
  selector: 'app-user-space',
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class UserSpaceComponent implements OnInit {
  loadingUser = false;
  loadingPassword = false;
  loadingDeleteAccount = false;
  userForm;
  passwordForm;
  currentUser;
  invalidPwd: boolean = false;
  unmatchedPwd: boolean = false;
  success: boolean = false;
  savedUser: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private ongletService: OngletService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.authService.userSubject.subscribe(
      (data) => {this.currentUser = data}
    );
    this.ongletService.ongletSubject.next(true);
    this.initUserForm();
    this.initPasswordForm();
  }


  initUserForm(){
    this.userForm = this.formBuilder.group({
      FirstName: [this.currentUser.FirstName, Validators.required],
      LastName: [this.currentUser.LastName, Validators.required],
      BirthDate: [this.currentUser.BirthDate, Validators.compose([PersonalValidator.ptDate, Validators.maxLength(10)])],
      Email: [this.currentUser.Email, Validators.email],
    });
  }
  initPasswordForm(){
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.minLength(7)],
      confirmPassword: ['', Validators.required]
    }, {validator: PersonalValidator.MustMatch('newPassword', 'confirmPassword')});
  }

  get uf(){
    return this.userForm.controls;
  }

  get pf(){
    return this.passwordForm.controls;
  }

   onSaveUser() {
    this.savedUser = false;
    this.loadingUser = true;
    let formValue = this.userForm.value;
    let firstName = formValue['FirstName'];
    let lastName = formValue['LastName'];
    let birthDate = formValue['BirthDate'];
    birthDate = this.convertDate(birthDate);
    const email = formValue['Email'];
    const userID = Number(this.currentUser.UserID)
    const role = Number(this.currentUser.Role);

    const updatedUser = new User();
    updatedUser.userID = userID;
    updatedUser.FirstName = firstName;
    updatedUser.LastName = lastName;
    updatedUser.BirthDate = birthDate
    updatedUser.Email = email;
    updatedUser.Role = role
    return this.userService.updateUser(updatedUser).subscribe(
      () => {
        this.authService.updateToken(this.currentUser.UserID);
        this.loadingUser = false
        this.savedUser = true;
      });
  }

    onChangePassword() {
    this.invalidPwd = false;
    this.loadingPassword = true;
    let formValue = this.passwordForm.value;
    let userID = Number(this.currentUser.UserID);
    let password = formValue['password'];
    let newPassword = formValue['newPassword'];
    const focusPassword = document.getElementById("password");
    focusPassword.style.border = '';

    const userToUpdate = new UserToUpdate();
    userToUpdate.userID = userID;
    userToUpdate.password = password;
    userToUpdate.newPassword = newPassword;
    return this.userService.updatePs(userToUpdate).subscribe(
      () => {
        this.passwordForm.reset();
        this.loadingPassword = false
        this.success = true;
      },
      () => {
        this.invalidPwd = true;
        this.loadingPassword = false;
        focusPassword.style.border = 'solid red';
        focusPassword.focus();
      });
  }

  onRemoveUser() {
    this.loadingDeleteAccount = true;
    return this.userService.removeUser(this.currentUser.UserID).subscribe(
      () => {
        this.loadingDeleteAccount = false;
        this.authService.logout();
      }
    );
  }



  convertDate(birthDate){
    const table = birthDate.split('-');
    const tempo = table[0];
    table[0] = table[2];
    table[2] = tempo;
    const checkInt = Number(table.join(''));
    if(!checkInt || table[1]>12 || table[0]> new Date().getFullYear()){
      return '';
    }
    else{
      return table.join('-');
    }
  }

}
