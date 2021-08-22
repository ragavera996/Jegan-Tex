import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export class User {
  constructor(public name: string, public value: any) {}
}

function autocompleteObjectValidator1(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-add-estimate',
  templateUrl: './add-estimate.component.html',
  styleUrls: ['./add-estimate.component.css']
})
export class AddEstimateComponent implements OnInit {

  billNumber: number;
  showTemplate: boolean = false;
  billForm: FormGroup;
  reloadFlag: boolean = false;
  mainFlag: boolean = true;
  template_list: any;
  size_list: any;
  filtered_size_list: any = [];
  billItems: FormArray;
  product_list: any;
  date = new FormControl(new Date());
  customer_list: any;
  userOptions = [];
  filteredOptions: Observable<User[]>;
  public myControl = new FormControl('', 
  { validators: [autocompleteObjectValidator1(), Validators.required] })
  public validation_msgs = {
    'myControl': [
      { type: 'invalidAutocompleteObject', message: 'Add address and phone.' },
      { type: 'required', message: 'Company is required.' }
    ]
  }
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, public snackBar: MatSnackBar) { }

  @Input() templateData: any;

  ngOnInit(): void {
    this.billForm = new FormGroup({
      billNumb: new FormControl('', []),
      billDate: new FormControl(this.date.value, [Validators.required]),
      myControl: new FormControl('', []),
      autoComplete: new FormControl('', []),
      customerId: new FormControl('', []),
      customerName: new FormControl('', []),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      totalAmount: new FormControl('', []),
      gst: new FormControl('', [Validators.required]),
      duplicateTotal: new FormControl('', []),
      total: new FormControl('', []),
      billItems: new FormArray([])
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
      });
      let response = this.userService.getEstimateBillNumber();
      response.subscribe((data: number) => {
        this.billNumber = data + 1;
        this.billForm.get('billNumb').setValue(this.billNumber);
        this.billForm.get('billNumb').disable();
      });
      this.addItem();
    this.billForm.get('duplicateTotal').disable();
    this.billForm.get('total').disable();
    this.billForm.get('address').disable();
    this.billForm.get('phone').disable();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith({} as User),
      map((user) => (user && typeof user === 'object' ? user.name : user)),
      map((name: string) =>
        name ? this.filter(name) : this.userOptions.slice()
      )
    );
    console.log(this.filteredOptions);
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

  enableAdd() {
    this.billForm.get('address').setValue('');
    this.billForm.get('phone').setValue('');
  }

  displayFn(user: User): string {
    return user ? user.name : '';
  }

  submit() {
    if (!this.billForm.valid) {
      return;
    } else {
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
    }
  }

  printEstimatePdf(billNumber: string) {
    this.userService.getEstimatePdf(billNumber).subscribe((data: any) => {
      this.template_list = data;
      this.showTemplate = true;
    });
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

  calcTotal() {
    let count = this.billItems.controls['length'];
    let total: number = 0;
    for (let i = 0; i < count; i++) {
      total = total + this.billItems.controls[i].get('price').value;
    }
    let tax: number = Number(this.billForm.controls['gst'].value);
    let totalTax: number = total == 0 ? tax : total + tax;
    this.billForm.get('gst').setValue(tax);
    this.billForm.get('duplicateTotal').setValue(total);
    this.billForm.get('total').setValue(totalTax);
  }

  addItem(): void {
    this.billItems = this.billForm.get('billItems') as FormArray;
    this.billItems.push(this.createItem());
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

  deleteItem(i: any): void {
    this.billItems = this.billForm.get('billItems') as FormArray;
    this.billItems.removeAt(i);
    this.calcTotal();
  }

  reload() {
    window.location.reload();
  }

  handleEmptyInput(event: any) {
    if (event.target.value === '') {
      this.billForm.controls['customerId'].setValue(0);
      this.billForm.controls['address'].setValue('');
      this.billForm.controls['phone'].setValue('');
    }
    this.calcTotal();
  }

  updateCompanyInfo(event: any) {
    this.billForm.controls['customerId'].setValue(
      event.option.value['value']['customerId']
    );
    this.billForm.controls['customerName'].setValue(event.option.value['value']['company_name']);
    this.billForm.controls['address'].setValue(
      event.option.value['value']['address']
    );
    this.billForm.controls['phone'].setValue(
      event.option.value['value']['phone']
    );
    this.calcTotal();
  }
}

