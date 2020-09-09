import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OngletService {
  hideOnglet: boolean = false;
  ongletSubject = new Subject();

  constructor() { }
}
