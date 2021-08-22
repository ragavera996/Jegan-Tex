import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppComponent } from './app.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { UserService } from './services/user.service';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ManageBillsComponent } from './manage-bills/manage-bills.component';
import {MatSelectModule} from '@angular/material/select';
import { PaymentsComponent } from './payments/payments.component';
import { SettingsComponent } from './settings/settings.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { TransactionsComponent } from './transactions/transactions.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ClientPaymentsComponent } from './client-payments/client-payments.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { AppRoutingModule } from './app.routing.module';
import { RouterModule } from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';
import { ProductUpdateDialogComponent } from './product-update-dialog/product-update-dialog.component';
import { ClientTxnsComponent } from './client-txns/client-txns.component';
import { AddEstimateComponent } from './add-estimate/add-estimate.component';
import { EstimateHistoryComponent } from './estimate-history/estimate-history.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    CreateFormComponent,
    AlertDialogComponent,
    DialogFormComponent,
    AddProductComponent,
    ManageProductComponent,
    AddBillComponent,
    ManageBillsComponent,
    PaymentsComponent,
    SettingsComponent,
    PaymentDialogComponent,
    TransactionsComponent,
    ClientPaymentsComponent,
    NavBarComponent,
    ProductUpdateDialogComponent,
    ClientTxnsComponent,
    AddEstimateComponent,
    EstimateHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatChipsModule,
    MatCheckboxModule,
    FormsModule,
    LayoutModule,
    MatListModule,
    MatGridListModule,
    NgbModule,
    NgxPrintModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
