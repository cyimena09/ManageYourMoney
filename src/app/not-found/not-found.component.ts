import { Component, OnInit } from '@angular/core';
import {OngletService} from '../services/onglet/onglet.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private ongletService: OngletService) { }

  ngOnInit(): void {
    this.ongletService.ongletSubject.next(true);
  }

}
