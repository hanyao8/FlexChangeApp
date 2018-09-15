import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  mainWallet = {currency: 'EUR', amount: 50.00, is_main: true};

  wallets = [
      {
        currency: 'USD', 
        amount: 53.00,
        pending: [
          {
            currency: 'CHF', 
            amount: 53.00,
            until: '2019-10-10'
          },
          {
            currency: 'EUR', 
            amount: 53.00,
            until: '2020-10-10'
          }
        ]
      },
      {currency: 'CHF', amount: 60.00},
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
  }

  ionViewDidLoad() {
  
  }

}
