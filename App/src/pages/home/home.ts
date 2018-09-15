import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public app: App, public navCtrl: NavController, private auth: AuthProvider) {
    if (!this.auth.isAuthenticated()) {
      this.app.getRootNav().setRoot(LoginPage);
      return;
    }
  }

  public logout() {
    this.auth.logout();
    this.app.getRootNav().setRoot(LoginPage);
  }
}
