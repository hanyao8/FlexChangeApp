import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import { WalletProvider, walletModel } from '../../providers/wallet/wallet';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  private intervalSubscription: Subscription;
  public mainWallet = this.walletProvider.mainWallet;
  public wallets = this.walletProvider.wallets;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private walletProvider: WalletProvider) {
    this.intervalSubscription = interval(3000).subscribe(() => this.walletProvider.getWalletsData());
  }

  ionViewDidLoad() {
    this.walletProvider.getWalletsData();
  }

  ionViewWillUnload() {
    this.intervalSubscription.unsubscribe();
  }

}
