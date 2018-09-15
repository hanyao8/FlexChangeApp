import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public app: App, private auth: AuthProvider) {
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
