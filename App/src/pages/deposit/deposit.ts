import { Component } from '@angular/core';
import { App, NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { DepositProvider } from "../../providers/deposit/deposit";
import { LoginPage } from "../login/login";
import { CurrencyProvider } from "../../providers/currency/currency";
import { Symbol } from "../../providers/currency/currency";

/**
 * Generated class for the DepositPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  depositForm: FormGroup;
  symbols: Symbol[];
  minDate: string;
  maxDate: string;

  constructor(private navCtrl: NavController,
              private app: App,
              private auth: AuthProvider,
              private currency: CurrencyProvider,
              private deposit: DepositProvider,
              private formBuilder: FormBuilder,
              private toast: ToastController) {
    if (!this.auth.isAuthenticated()) {
      this.app.getRootNav().setRoot(LoginPage);
      return;
    }
    this.minDate = this.getCurrentDate();
    this.maxDate = this.getMaxDate();
    this.buildForm();
    this.currency.getCurrencies()
      .then((symbols: Symbol[]) => {
        this.symbols = symbols;
      });
  }

  public depositTransaction() {
    if (!this.depositForm.valid) {
      return;
    }

    // TODO Get Currency From from MainAccount Wallet Service
    const currencyFrom = "EUR";
    const currencyTo = this.depositForm.controls['currencyTo'].value;
    const amount = this.depositForm.controls['amount'].value;
    const until = this.depositForm.controls['until'].value;
    this.deposit.depositTransaction(currencyFrom, currencyTo, amount, until)
      .subscribe((depositedSuccessfully: boolean) => {
        if (depositedSuccessfully) {
          this.navCtrl.pop();
          const toast = this.toast.create({
            message: `Created deposit of ${amount} to transfer from ${currencyFrom} to ${currencyTo}`,
            duration: 3000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
          });
          toast.present();
          return;
        }

        const toast = this.toast.create({
          message: `Could not create deposit. Please check that you have enough money.`,
          duration: 3000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'OK',
        });
        toast.present();
      })
  }

  public cancelDeposit() {
    this.navCtrl.pop();
  }

  private buildForm() {
    this.depositForm = this.formBuilder.group({
      currencyTo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      until: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/[0-9]*\.?[0-9]+/)]]
    });
  }

  private getCurrentDate() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  private getMaxDate() {
    let d = new Date();
    d.setFullYear(d.getFullYear() + 3);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
}
