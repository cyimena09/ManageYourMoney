import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {OngletService} from '../../services/onglet/onglet.service';
import {fadeInAnimation} from '../../models/animations/fadeAnimation';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class UsersListComponent implements OnInit {
  users;
  currentUser

  constructor(private userService: UserService, private  ongletService: OngletService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    console.log(this.currentUser)
    this.ongletService.ongletSubject.next(true)
    this.userService.getUsers().subscribe(
      (data) => {this.users = data;}
    );


  }

}
