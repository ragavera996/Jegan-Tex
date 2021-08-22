import { UserTable } from './../../userTable';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ProductTable } from 'src/productTable';
import { BillTable } from 'src/billTable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url: string = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  getClientPaymentData(billForm: FormGroup) {
    return this.http.post(this.api_url + 'getClientPaymentData', billForm)
      .pipe(
        map((data: UserTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getPdf(billNumber: string) {
    return this.http.get(this.api_url + 'downloadBill?billNumber=' + billNumber);
  }

  getEstimatePdf(billNumber: string) {
    return this.http.get(this.api_url + 'downloadEstimateBill?billNumber=' + billNumber);
  }

  getBill(billNumber: string) {
    return this.http.get(this.api_url + 'editBill?billNumber=' + billNumber);
  }

  getBillNumber() {
    return this.http.get(this.api_url + 'getBillNumber');
  }

  getEstimateBillNumber() {
    return this.http.get(this.api_url + 'getEstimateBillNumber');
  }

  updatePayment(dialogForm: FormGroup) {
    return this.http.post(this.api_url + 'updatePayment', dialogForm);
  }

  getPaymentData() {
    return this.http.get(this.api_url + 'getPaymentData')
      .pipe(
        map((data: UserTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getTransactionData() {
    return this.http.get(this.api_url + 'getTransactionData')
      .pipe(
        map((data: UserTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getGst() {
    return this.http.get(this.api_url + 'getGst');
  }

  getCustomersData() {
    return this.http.get(this.api_url + 'getCustomersData')
      .pipe(
        map((data: UserTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getSizeData() {
    return this.http.get(this.api_url + 'getSizeData')
      .pipe(
        map((data: UserTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getProductsData() {
    return this.http.get(this.api_url + 'getProductsData')
      .pipe(
        map((data: UserTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getFilteredUser(searchForm: FormGroup) {
    return this.http.post(this.api_url + 'filterData', searchForm)
      .pipe(
        map((data: UserTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getProductData(productForm: FormGroup) {
    return this.http.post(this.api_url + 'getProductData', productForm)
      .pipe(
        map((data: ProductTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getBillData(billForm: FormGroup) {
    return this.http.post(this.api_url + 'getBillData', billForm)
      .pipe(
        map((data: BillTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  getEstimateBillData(billForm: FormGroup) {
    return this.http.post(this.api_url + 'getEstimateBillData', billForm)
      .pipe(
        map((data: BillTable[]) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong');
        })
      )
  }

  addSize(value: string) {
    return this.http.post(this.api_url + 'addSize', value);
  }

  addGst(value: string) {
    return this.http.post(this.api_url + 'addGst', value);
  }

  deleteSize(value: string) {
    return this.http.post(this.api_url + 'deleteSize', value);
  }

  createData(loginForm: FormGroup) {
    return this.http.post(this.api_url + 'userInsert', loginForm);
  }

  addProduct(productForm: FormGroup) {
    return this.http.post(this.api_url + 'addProduct', productForm);
  }

  generateBill(billForm: FormGroup) {
    return this.http.post(this.api_url + 'generateBill', billForm);
  }

  updateBill(billForm: FormGroup) {
    return this.http.post(this.api_url + 'updateBill', billForm);
  }

  generateEstimate(billForm: FormGroup) {
    return this.http.post(this.api_url + 'generateEstimate', billForm);
  }

  updateData(dialogForm: FormGroup) {
    return this.http.post(this.api_url + 'updateUser', dialogForm);
  }

  updateProduct(dialogForm: FormGroup) {
    return this.http.post(this.api_url + 'updateProduct', dialogForm);
  }
}
