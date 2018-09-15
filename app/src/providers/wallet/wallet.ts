import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { WalletPage } from '../../pages/wallet/wallet';

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
  protected mainWallet: BehaviorSubject<walletModel[]> = new BehaviorSubject([]);
  protected wallets: BehaviorSubject<walletModel[]> = new BehaviorSubject([]);

  constructor(public http: HttpClient) {
  }

  getWalletsData(): Observable<walletModel> { 
    return this.http.get<Observable<walletModel>>(this.walletApi).pipe(
      map((response: any) => response = response.wallets)
    ).subscribe(
      (response) => {
        const mainWalletArr = [];
        const walletsArr = [];
        for ( const i = 0; i < response.length; i++ ) {
          if ( response[i].is_main ) {
            mainWalletArr.push(response[i]);
          } else {
            walletsArr.push(response[i]);
          }
        }
        this.mainWallet.next(mainWalletArr);
        this.wallets.next(walletsArr);
      }
    );
  }

}
