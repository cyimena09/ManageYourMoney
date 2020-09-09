import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user/user.service';
import {OngletService} from '../services/onglet/onglet.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users;

  constructor(private userService: UserService, private  ongletService: OngletService) { }

  ngOnInit(): void {
    this.ongletService.ongletSubject.next(true)
    this.userService.getUsers().subscribe(
      (data) => {this.users = data;}
    )
  }

}
