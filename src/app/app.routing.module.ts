import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AddBillComponent } from './add-bill/add-bill.component';
import { ManageBillsComponent } from './manage-bills/manage-bills.component';
import { ClientPaymentsComponent } from './client-payments/client-payments.component';
import { PaymentsComponent } from './payments/payments.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ClientTxnsComponent } from './client-txns/client-txns.component';
import { AddEstimateComponent } from './add-estimate/add-estimate.component';
import { EstimateHistoryComponent } from './estimate-history/estimate-history.component';

const routes: Routes = [
  {
    path: "",
    component: AddBillComponent
},
    {
        path: "jegantex",
        component: AddBillComponent
    },
    {
        path: "billHistory",
        component: ManageBillsComponent
    },
    {
      path: "paymentHistory",
      component: ClientPaymentsComponent
    },
    {
      path: "totalPayments",
      component: PaymentsComponent
    },
    {
      path: "manageCustomers",
      component: SearchFormComponent
    },
    {
      path: "manageProducts",
      component: ManageProductComponent
    },
    {
      path: "addEstimate",
      component: AddEstimateComponent
    },
    {
      path: "estimateHistory",
      component: EstimateHistoryComponent
    }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
