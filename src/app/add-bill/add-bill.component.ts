import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export class User {
  constructor(public name: string, public value: any) {}
}

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.css'],
})
export class AddBillComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) _auto2: MatAutocompleteTrigger;
  filteredOptions: Observable<User[]>;

  userOptions = [];
  selected = 'option1';
  pendingFlag: boolean = true;
  date = new FormControl(new Date());
  billForm: FormGroup;
  billItems: FormArray;
  billNumber: number;
  customer_list: any;
  product_list: any;
  size_list: any;
  filtered_size_list: any = [];
  displayFalse: boolean = false;
  reloadFlag: boolean = false;
  mainFlag: boolean = true;
  template_list: any;
  showTemplate: boolean = false;
  auto: any;
  totalAmount: number = 0;
  totalPending: number = 0;
  public myControl = new FormControl('', 
      { validators: [autocompleteObjectValidator(), Validators.required] })
      public validation_msgs = {
        'myControl': [
          { type: 'invalidAutocompleteObject', message: 'Add address and phone.' },
          { type: 'required', message: 'Company is required.' }
        ]
      }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public snackBar: MatSnackBar
  ) {}

  @Input() templateData: any;

  ngOnInit() {
    this.billForm = new FormGroup({
      billNumb: new FormControl('', []),
      billDate: new FormControl(this.date.value, [Validators.required]),
      myControl: new FormControl('', []),
      autoComplete: new FormControl('', []),
      customerId: new FormControl('', []),
      customerName: new FormControl('', []),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      paymentStatus: new FormControl('', []),
      pendingBalance: new FormControl('', []),
      pendingAmount: new FormControl('', []),
      totalAmount: new FormControl('', []),
      totalPending: new FormControl('', []),
      originalBillNumber: new FormControl('', []),
      originalBillAmount: new FormControl('', []),
      gst: new FormControl('', [Validators.required]),
      duplicateTotal: new FormControl('', []),
      total: new FormControl('', []),
      paidAmount: new FormControl('', [Validators.required]),
      paymentType: new FormControl('', []),
      transportName: new FormControl('', []),
      billItems: new FormArray([]),
      billType:  new FormControl('', [])
    });
    this.userService.getCustomersData().subscribe({
      next: (list) => {
        this.customer_list = list;
      },
      complete: () => {
        for (let i = 0; i < this.customer_list.length; i++) {
          this.userOptions.push(
            new User(
              this.customer_list[i]['company_name'],
              this.customer_list[i]
            )
          );
        }
        if (this.templateData) {
        let customer = this.customer_list.filter(p=>p.customerId==this.templateData[0]['customerId']);
        this.myControl.setValue(new User(
          customer[0]['company_name'],
          customer[0]
        ));
        this.billForm.controls['customerId'].setValue(
          this.templateData[0]['customerId']
        );
        }
      },
    });
    let respon = this.userService.getSizeData();
    respon.subscribe(
      list => {
        this.size_list = list;
        this.filtered_size_list[0] = this.size_list;
      });
    let resp = this.userService.getProductsData();
    resp.subscribe(
      list => {
        this.product_list = list;
        if (this.templateData) {
          this.billItems = this.billForm.get('billItems') as FormArray;
          for (let a = 0; a < this.templateData.length; a++) {
            this.billItems.push(this.createBillItem(a, list));
            let id = this.templateData[a]['productId'];
            let size = this.templateData[a]['size'];
            let productList = this.product_list.filter(p=>p.productId == id);
            this.billItems.controls[a].get('product').setValue(productList[0], {onlySelf: true});
            let sizeList = this.size_list.filter(p=>p.product_id == id);
            this.filtered_size_list[a] = sizeList;
            let filterList = sizeList.filter(p=>p.size == size);
            this.billItems.controls[a].get('size').setValue(filterList[0], {onlySelf: true});
          }
          this.calcBillTotal();
        }
      });
   

    if (this.templateData) {
      this.billForm.get('totalAmount').setValue(this.templateData[0]['total_amount']);
      this.billForm.get('totalPending').setValue(this.templateData[0]['pending_amount']);
      this.billNumber = this.templateData[0]['bill_number'];
      this.billForm.get('billNumb').setValue(this.billNumber);
      this.billForm.get('billNumb').disable();
      this.billForm.get('billDate').setValue(this.templateData[0]['date_og']);
      this.billForm.controls['customerId'].setValue(
        this.templateData[0]['customerId']
      );
      this.billForm.controls['address'].setValue(
        this.templateData[0]['address']
      );
      this.billForm.controls['phone'].setValue(this.templateData[0]['phone']);
      this.billForm.controls['paymentStatus'].setValue("Pending");
      this.billForm.controls['pendingBalance'].setValue(
        this.templateData[0]['pending_amount']
      );
      this.billForm.get('address').disable();
      this.billForm.get('phone').disable();
      this.billForm.controls['originalBillNumber'].setValue(
        this.templateData[0]['original_bill_number']
      );
      this.billForm.controls['originalBillAmount'].setValue(
        this.templateData[0]['original_bill_amount']
      );
      this.billForm.controls['duplicateTotal'].setValue(
        this.templateData[0]['duplicateBillTotal']
      );
      this.billForm.controls['paidAmount'].setValue(
        this.templateData[0]['payment_amount']
      );
      this.billForm.controls['paymentType'].setValue(
        this.templateData[0]['payment_type']
      );
      this.billForm.controls['transportName'].setValue(
        this.templateData[0]['transport']
      );
      if (this.templateData[0]['pending_amount'] > 0) {
        this.billForm.controls['pendingAmount'].setValue(
          this.templateData[0]['pending_amount']
        );
        this.pendingFlag = true;
      } else {
        this.billForm.controls['pendingAmount'].setValue(0);
        this.pendingFlag = false;
      }
      // this.billForm.patchValue(this.templateData);
    } else {
      let response = this.userService.getBillNumber();
      response.subscribe((data: number) => {
        this.billNumber = data + 1;
        this.billForm.get('billNumb').setValue(this.billNumber);
        this.billForm.get('billNumb').disable();
      });
      this.billForm.controls['paymentStatus'].setValue('Payment Status');
      this.addItem();
    }
    this.billForm.get('duplicateTotal').disable();
    this.billForm.get('total').disable();
    this.billForm.get('address').disable();
    this.billForm.get('phone').disable();
    this.billForm.get('pendingBalance').disable();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith({} as User),
      map((user) => (user && typeof user === 'object' ? user.name : user)),
      map((name: string) =>
        name ? this.filter(name) : this.userOptions.slice()
      )
    );
    console.log(this.filteredOptions);
  }

  changeType(event: any) {
    if (event.value === 'option1') {
      let response = this.userService.getBillNumber();
      response.subscribe((data: number) => {
        this.billNumber = data + 1;
        this.billForm.get('billNumb').setValue(this.billNumber);
        this.billForm.get('billNumb').disable();
      });
      this.billForm.controls['billType'].setValue('option1');
      this.billForm.get('address').disable();
      this.billForm.get('phone').disable();
    } else {
      let response = this.userService.getEstimateBillNumber();
      response.subscribe((data: number) => {
        this.billNumber = data + 1;
        this.billForm.get('billNumb').setValue(this.billNumber);
        this.billForm.get('billNumb').disable();
      });
      this.billForm.controls['billType'].setValue('option2');
      this.billForm.controls['customerId'].setValue(0);
      this.billForm.controls['paymentStatus'].setValue('Payment Status');
      this.billForm.controls['address'].setValue('');
      this.billForm.controls['phone'].setValue('');
      this.billForm.get('address').enable();
      this.billForm.get('phone').enable();
      this.billForm.get('paidAmount').setValue(0);
      this.billForm.controls['pendingBalance'].setValue(0);
      this.billForm.controls['total'].setValue(0);
    }
  }

  handleEmptyInput(event: any) {
    if (event.target.value === '') {
      this.billForm.controls['customerId'].setValue(0);
      this.billForm.controls['paymentStatus'].setValue('Payment Status');
      this.billForm.controls['address'].setValue('');
      this.billForm.controls['phone'].setValue('');
      this.billForm.controls['pendingBalance'].setValue(0);
    }
    this.calcTotal();
  }

  filter(name: string): User[] {
    let userArray:User[] = this.userOptions.filter(
      (option) => option.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
    if(userArray.length === 0){
      this.enableAdd();
      this.billForm.get('address').enable();
      this.billForm.get('phone').enable();
      this.billForm.controls['customerId'].setValue(0);
      this.billForm.controls['customerName'].setValue(name);
    }else {
    this.billForm.get('address').disable();
    this.billForm.get('phone').disable();
    }
    return userArray;
  }

  displayFn(user: User): string {
    return user ? user.name : '';
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      product: '',
      size: [{ value: '', disabled: true }],
      quantity: [{ value: '', disabled: true }],
      rate: [{ value: '', disabled: true }],
      price: [{ value: '', disabled: true }],
    });
  }

  createBillItem(a: number, list: any): FormGroup {
    return this.formBuilder.group({
      product: '',
      size: '',
      quantity: [{ value: this.templateData[a]['quantity'], disabled: false }],
      rate: [{ value: this.templateData[a]['rate'], disabled: true }],
      price: [{ value: this.templateData[a]['amount'], disabled: true }],
    });
  }

  updateCompanyInfo(event: any) {
    this.billForm.controls['customerId'].setValue(
      event.option.value['value']['customerId']
    );
    this.billForm.controls['address'].setValue(
      event.option.value['value']['address']
    );
    this.billForm.controls['phone'].setValue(
      event.option.value['value']['phone']
    );
    this.billForm.controls['paymentStatus'].setValue(
      event.option.value['value']['status']
    );
    this.billForm.controls['pendingBalance'].setValue(
      event.option.value['value']['balance_amount']
    );
    this.billForm.controls['pendingAmount'].setValue(
      this.billForm.controls['pendingBalance'].value
    );
    this.calcTotal();
  }

  enableSize(i: number) {
    let filter_size_list = this.size_list.filter(
      (x) =>
        x.product_id ==
        this.billItems.controls[i].get('product').value.productId
    );
    this.filtered_size_list[i] = filter_size_list;
    this.billItems.controls[i].get('size').enable();
    this.billItems.controls[i].get('rate').setValue(0);
    this.billItems.controls[i].get('quantity').setValue('');
    this.billItems.controls[i].get('price').setValue(0);
    this.billItems.controls[i].get('quantity').disable();
  }

  enableAdd() {
    this.billForm.get('address').setValue('');
    this.billForm.get('phone').setValue('');
    this.billForm.controls['paymentStatus'].setValue('Paid');
    this.billForm.controls['pendingBalance'].setValue(0);
  }

  enableQuantity(i: number) {
    this.billItems.controls[i]
      .get('rate')
      .setValue(this.billItems.controls[i].get('size').value['price']);
    this.billItems.controls[i].get('quantity').enable();
    this.calcPrice(i);
  }

  calcPrice(i: number) {
    let price = this.billItems.controls[i].get('size').value['price'];
    let qty = this.billItems.controls[i].get('quantity').value;
    this.billItems.controls[i].get('price').setValue(qty * price);
    this.calcTotal();
  }

  calcBillTotal() {
    let count = this.billItems.controls['length'];
    let total: number = 0;
    for (let i = 0; i < count; i++) {
      total = total + this.billItems.controls[i].get('price').value;
    }
    let tax: number = this.templateData[0]['tax'];
    let totalTax: number = total == 0 ? tax : total + tax;
    let pending: number = Number(this.billForm.get('pendingBalance').value);
    if (this.pendingFlag) {
      totalTax = totalTax + pending;
    }
    else this.billForm.get('gst').setValue(tax);
    this.billForm.get('duplicateTotal').setValue(total);
    this.billForm.get('total').setValue(totalTax);
    this.billForm.get('duplicateTotal').disable();
    this.billForm.get('total').disable();
  }

  calcTotal() {
    let count = this.billItems.controls['length'];
    let total: number = 0;
    for (let i = 0; i < count; i++) {
      total = total + this.billItems.controls[i].get('price').value;
    }
    let tax: number = Number(this.billForm.controls['gst'].value);
    let totalTax: number = total == 0 ? tax : total + tax;
    let pending: number = Number(this.billForm.get('pendingBalance').value);
    let finalTotal = Number(this.billForm.get('total').value);
    if (this.pendingFlag) {
      totalTax = totalTax + pending;
    }
    this.billForm.get('gst').setValue(tax);
    this.billForm.get('duplicateTotal').setValue(total);
    this.billForm.get('total').setValue(totalTax);
  }

  addItem(): void {
    this.billItems = this.billForm.get('billItems') as FormArray;
    this.billItems.push(this.createItem());
  }

  deleteItem(i: any): void {
    this.billItems = this.billForm.get('billItems') as FormArray;
    this.billItems.removeAt(i);
    this.calcTotal();
  }

  submit() {
    if (!this.billForm.valid) {
      return;
    } else {
      if(this.billForm.controls['billType'].value == 'option2'){
        this.mainFlag = false;
        this.reloadFlag = true;
        let response = this.userService.generateEstimate(this.billForm.getRawValue());
        response.subscribe((data) => {
          if (data == '0') {
            this.snackBar.open('Bill failed!', 'Close');
          } else {
            this.printEstimatePdf(this.billForm.controls['billNumb'].value);
          }
        });
      } else {
        this.mainFlag = false;
        this.reloadFlag = true;
        if(this.templateData){
        let response = this.userService.updateBill(this.billForm.getRawValue());
        response.subscribe((data) => {
          if (data == '0') {
            this.snackBar.open('Bill failed!', 'Close');
          } else {
            this.printPdf(this.billForm.controls['billNumb'].value);
          }
        });
      } else{
        let response = this.userService.generateBill(this.billForm.getRawValue());
        response.subscribe((data) => {
          if (data == '0') {
            this.snackBar.open('Bill failed!', 'Close');
          } else {
            this.printPdf(this.billForm.controls['billNumb'].value);
          }
        });
      }
      }
    }
  }

  printPdf(billNumber: string) {
    this.userService.getPdf(billNumber).subscribe((data: any) => {
      this.template_list = data;
      this.showTemplate = true;
    });
  }

  printEstimatePdf(billNumber: string) {
    this.userService.getEstimatePdf(billNumber).subscribe((data: any) => {
      this.template_list = data;
      this.showTemplate = true;
    });
  }

  reload() {
    window.location.reload();
  }

  addPending(event) {
    if (event.checked) {
      this.billForm.controls['pendingAmount'].setValue(
        this.billForm.controls['pendingBalance'].value
      );
      this.pendingFlag = true;
    } else {
      this.billForm.controls['pendingAmount'].setValue(0);
      this.pendingFlag = false;
    }
    this.calcTotal();
  }
}
