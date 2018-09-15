import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Headers } from '@angular/http';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  walletModel: {
    currency: string;
    amount: number;
    is_true: boolean;
    pending: {
      currency_to: string;
      amount: number;
      until: string;
    };
  }

  private walletApi = 'http://radiant-earth-58477.herokuapp.com/wallets';

  mainWallet = {currency: 'EUR', amount: 50.00, is_main: true};

  wallets = [
      {
        currency: 'USD', 
        amount: 53.00,
        pending: [
          {
            currency_to: 'CHF', 
            amount: 53.00,
            until: '2019-10-10'
          },
          {
            currency_to: 'EUR', 
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
    this.getWalletsData();
  }

  getWalletsData(): any {
    return this.http.get(this.walletApi).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

}
