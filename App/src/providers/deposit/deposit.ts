import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { map } from "rxjs/operators";


@Injectable()
export class DepositProvider {

  constructor(private http: HttpClient) {
  }

  public depositTransaction(currencyFrom: string, currencyTo: string, amount: number, until: string): Observable<boolean> {
    const data = {
      currency_from: currencyFrom,
      currency_to: currencyTo,
      amount: amount,
      until: until,
    };
    console.log(data);
    const url = environment.serverUrl + '/transaction';
    return this.http.post(url, JSON.stringify(data))
      .pipe(
        map((response: any) => {
          console.log(response);
          if (response && 'success' in response) {
            return response.success;
          }
          return false;
        })
      );
  }

}
