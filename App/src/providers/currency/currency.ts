import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Symbol {
  abbreviation: string;
  name: string;
}

@Injectable()
export class CurrencyProvider {

  private symbols: Symbol[] = [];

  constructor(private http: HttpClient) {
  }

  public async getCurrencies(): Promise<Symbol[]> {
    if (this.symbols.length > 0) {
      return this.symbols;
    }
    const url = 'http://data.fixer.io/api/symbols?access_key=e3d4f3d95eca7c7ace9635057e74cbc4';
    const response = <any>await this.http.get(url).toPromise();
    console.log(response);
    for (let key in response.symbols) {
      this.symbols.push({abbreviation: key, name: response.symbols[key]});
    }

    console.log(this.symbols);
    return this.symbols;
  }


}
