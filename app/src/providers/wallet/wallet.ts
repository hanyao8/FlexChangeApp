import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface walletModel {
  currency: string;
  amount: number;
  is_main: boolean;
  pending: {
    currency_to: string;
    amount: string;
    until: string;
  };
}

@Injectable()
export class WalletProvider {
  private walletApi = 'http://radiant-earth-58477.herokuapp.com/wallets';
  public mainWallet: BehaviorSubject<walletModel[]> = new BehaviorSubject([]);
  public wallets: BehaviorSubject<walletModel[]> = new BehaviorSubject([]);

  constructor(public http: HttpClient) {
  }

  getWalletsData() {
    this.http.get<Observable<walletModel>>(this.walletApi)
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response && 'wallets' in response) {
            response = response.wallets;
            const mainWalletArr = [];
            const walletsArr = [];
            console.log(response);
            for (let i = 0; i < response.length; i++) {
              if (response[i].is_main) {
                mainWalletArr.push(response[i]);
              } else {
                walletsArr.push(response[i]);
              }
            }
            this.mainWallet.next(mainWalletArr);
            this.wallets.next(walletsArr);
          }

        }
      );
  }

}
