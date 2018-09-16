import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from "../../environment/environment";

export interface walletModel {
  currency: string;
  amount: number;
  is_main: boolean;
  pending: {
    currency_to: string;
    amount: string;
    until: string;
  }[];
}

@Injectable()
export class WalletProvider {
  public mainWallet: BehaviorSubject<walletModel[]> = new BehaviorSubject([]);
  public wallets: BehaviorSubject<walletModel[]> = new BehaviorSubject([]);

  constructor(public http: HttpClient) {
  }

  getWalletsData() {
    const url = environment.serverUrl + '/wallets';
    this.http.get<Observable<walletModel>>(url)
      .subscribe(
        (response: any) => {
          if (response && 'wallets' in response) {
            response = response.wallets;
            const mainWalletArr = [];
            const walletsArr = [];
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
