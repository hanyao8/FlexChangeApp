import { Component } from '@angular/core';

import { WalletPage } from '../wallet/wallet';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = WalletPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
