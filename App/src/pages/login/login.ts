import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from "../../providers/auth/auth";
import { TabsPage } from "../tabs/tabs";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  isLoading = false;
  error = false;
  loginForm: FormGroup;


  constructor(public app: App,
              private formBuilder: FormBuilder,
              private auth: AuthProvider) {
    this.buildForm();
  }

  public login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.error = false;
    this.isLoading = true;
    this.auth.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
      .subscribe((hasLoggedIn: boolean) => {
        console.log(hasLoggedIn);
        if (hasLoggedIn) {
          this.isLoading = false;
          // todo remove after API fix
          localStorage.setItem('token', 'YOU REALLY NEED TO REMOVE THIS TOKEN');
          this.app.getRootNav().setRoot(TabsPage);
          return;
        }
        this.isLoading = false;
        this.error = true;
      });
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

}
