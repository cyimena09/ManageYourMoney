import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {OngletService} from '../services/onglet/onglet.service';
import {UserService} from '../services/user/user.service';
import {NgForm} from '@angular/forms';
import {UserToUpdate} from '../models/userToUpdate';
import {User} from '../models/user';

@Component({
  selector: 'app-user-space',
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.scss']
})
export class UserSpaceComponent implements OnInit, OnDestroy {
  currentUser;
  invalidPwd: boolean = false;
  invalidDate: boolean = false;
  unmatchedPwd: boolean = false;
  invalidLenght: boolean = false;
  success: boolean = false;
  deleteAccount: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private ongletService: OngletService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.ongletService.ongletSubject.next(true);
    if(this.currentUser.BirthDate.length == 0){
      this.invalidDate = true
    }
  }

  onChangePassword(form: NgForm){
    const userID = Number(this.currentUser.UserID);
    const password = form.value['password'];
    const newPassword = form.value['newPassword'];
    const confirmPassword = form.value['confirmPassword'];
    const focusPassword = document.getElementById("password");
    const focusNewPassword = document.getElementById("newPassword");
    const focusConfirmPassword = document.getElementById("confirmPassword");

    this.invalidLenght = false;
    this.unmatchedPwd = false;

    focusPassword.style.border = '';
    focusNewPassword.style.border = '';
    focusConfirmPassword.style.border = '';

    if(newPassword.length < 7){
      focusNewPassword.style.border = 'solid red';
      focusNewPassword.focus();
      return this.invalidLenght = true;
    }

    if(newPassword !== confirmPassword){
      focusNewPassword.style.border = 'solid red';
      focusConfirmPassword.style.border = 'solid red';
      focusConfirmPassword.focus();
      this.invalidPwd = false;
      return this.unmatchedPwd = true;
    }


    else {
      this.unmatchedPwd = false;
      const userToUpdate = new UserToUpdate();
      userToUpdate.userID = userID;
      userToUpdate.password = password;
      userToUpdate.newPassword = newPassword;
      return this.userService.updatePs(userToUpdate).subscribe(
        () => {
          form.resetForm();
          this.success = true; this.unmatchedPwd = false; this.invalidPwd = false; this.invalidLenght = false;},
        () => {
          this.invalidPwd = true
          focusPassword.style.border = 'solid red';
          focusPassword.focus();
        }
        );
    }
  }

  onRemoveUser(){
    this.deleteAccount = true;
    return this.userService.removeUser(this.currentUser.UserID).subscribe(
      () => {this.authService.logout();}
    );
  }

  saveUser(){
    const updatedUser = new User();
    updatedUser.userID = Number(this.currentUser.UserID);
    updatedUser.FirstName = this.currentUser.FirstName;
    updatedUser.LastName = this.currentUser.LastName;
    updatedUser.BirthDate = this.onConvertDate();
    updatedUser.Email = this.currentUser.Email;
    updatedUser.Role = Number(this.currentUser.Role);

    if(this.invalidDate == false){
      return this.userService.updateUser(updatedUser).subscribe(
        () => {this.authService.updateToken(this.currentUser.UserID)},
        () => {this.invalidDate = true}
        );
    }
  }

  ngOnDestroy(){
    if(!this.deleteAccount){
      this.saveUser();
    }
  }

  onConvertDate(){
    const table = this.currentUser.BirthDate.split('-');
    const tempo = table[0];
    table[0] = table[2];
    table[2] = tempo;
    const checkInt = Number(table.join(''));

    if(!checkInt || table[1]>12 || table[0]> new Date().getFullYear()){
      this.invalidDate = true
    }
    else{
      return table.join('-');
    }
  }

}
