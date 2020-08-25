import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Manage Your Money';
  gestionActivated: boolean = true;
  comparateurActivated: boolean = false
  historiqueActivated: boolean = false

  date = new Date().getFullYear();


  onGestionActivated(){
    this.gestionActivated = true;
    this.comparateurActivated = false;
    this.historiqueActivated = false;
  }

  onComparateurActivated(){
    this.comparateurActivated = true
    this.gestionActivated = false;
    this.historiqueActivated = false
  }

  onHistoriqueActivated(){
    this.historiqueActivated = true;
    this.gestionActivated = false;
    this.comparateurActivated = false
  }
}
