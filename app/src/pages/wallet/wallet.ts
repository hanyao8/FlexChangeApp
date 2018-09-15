import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import { WalletProvider, walletModel } from '../../providers/wallet/wallet';
import { LoginPage } from "../login/login";
import { AuthProvider } from "../../providers/auth/auth";
import { DepositPage } from "../deposit/deposit";

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  private intervalSubscription: Subscription;
  public mainWallet = this.walletProvider.mainWallet;
  public wallets = this.walletProvider.wallets;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpClient,
              private walletProvider: WalletProvider,
              public app: App,
              private auth: AuthProvider) {
    if (!this.auth.isAuthenticated()) {
      this.app.getRootNav().setRoot(LoginPage);
      return;
    }
    this.intervalSubscription = interval(3000).subscribe(() => this.walletProvider.getWalletsData());
  }

  ionViewWillLoad() {
    this.walletProvider.getWalletsData();
  }

  ionViewWillUnload() {
    this.intervalSubscription.unsubscribe();
  }

  public logout() {
    this.auth.logout();
    this.app.getRootNav().setRoot(LoginPage);
  }

  public createDeposit() {
    this.navCtrl.push(DepositPage);
  }
}
