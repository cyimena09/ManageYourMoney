import { Component, OnInit } from '@angular/core';
import {slideRightLeftAnimation} from '../../../models/animations/slideRightLeftAnimation';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {User} from '../../../models/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  animations: [slideRightLeftAnimation],
  host: { '[@slideRightLeftAnimation]': '' }
})
export class UserDetailComponent implements OnInit {

  loading = false;
  id = this.activatedRoute.snapshot.params['id'];
  user: any = []

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    return this.userService.getUser(this.id).subscribe(
      (user) => {this.user = user;  console.log("luser est :", this.user)}
    );
  }

  onUpdateUser(){
    this.loading = true;

    let firstName = this.user.firstName;
    let lastName = this.user.lastName;
    let birthDate = this.user.birthDate;
    const email = this.user.email;
    const userID = this.user.userID
    const role = 1

    const updatedUser = new User();
    updatedUser.userID = userID;
    updatedUser.FirstName = firstName;
    updatedUser.LastName = lastName;
    updatedUser.BirthDate = birthDate
    updatedUser.Email = email;
    updatedUser.Role = role
    return this.userService.updateUser(updatedUser).subscribe(
      () => {
        this.loading = false;
      });
  }
}
