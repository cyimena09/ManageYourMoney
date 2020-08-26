import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  currentUser
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userSubject.subscribe(
      (data) => {this.currentUser = data;}
    );
  }

}
