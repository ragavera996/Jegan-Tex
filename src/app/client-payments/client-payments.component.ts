import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserTable } from 'src/userTable';
import { User } from '../add-bill/add-bill.component';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { ActivatedRoute } from '@angular/router';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-client-payments',
  templateUrl: './client-payments.component.html',
  styleUrls: ['./client-payments.component.css']
})
export class ClientPaymentsComponent implements AfterViewInit, OnInit {
  filteredOptions: Observable<User[]>;
  showTxn: boolean = false;
  showPrint: boolean = true;
  userOptions = [];
  billForm: FormGroup;
  customer_list: any;
  paymentList: any;
  creditTotal: number = 0;
  debitTotal: number = 0;
  customerName: String;
  displayedColumns: string[] = ['date',  'original_bill_number', 'duplicate_bill_number','payment_type', 'debit', 'credit'];
  dataSource: MatTableDataSource<UserTable>;
  paymentData: [];
  customer_id:number;
  submitFlag: boolean = true;
  public myControl = new FormControl('', 
      { validators: [autocompleteObjectValidator(), Validators.required] })
      public validation_msgs = {
        'myControl': [
          { type: 'invalidAutocompleteObject', message: 'Company name not available.' },
          { type: 'required', message: 'Company is required.' }
        ]
      }

  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute,private formBuilder: FormBuilder, private userService:UserService, private dialog: MatDialog) {  }

  ngOnInit() {
    this.billForm = this.formBuilder.group({
      myControl: new FormControl('', []),
      autoComplete: new FormControl('', []),
      customerId: new FormControl('', []),
      start: new FormControl('', []),
      end: new FormControl('',[])
     });
    this.dataSource = new MatTableDataSource();
    this.userService.getCustomersData().subscribe({
      next: list => { (this.customer_list = list) },
      complete: () => {
        for (let i = 0; i < this.customer_list.length; i++) {
          this.userOptions.push(new User(this.customer_list[i]['company_name'], this.customer_list[i]));
        }

      }
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith({} as User),
      map((user) => (user && typeof user === 'object' ? user.name : user)),
      map((name: string) =>
        name ? this.filter(name) : this.userOptions.slice()
      )
    );
    this.route.queryParams.subscribe(
      params => {
        this.customer_id =  params['customerId'];
        if(this.customer_id > 0) {
          this.billForm.controls['customerId'].setValue(this.customer_id);
          let res = this.userService.getClientPaymentData(this.billForm.getRawValue());
          res.subscribe((list) => {
            if (list[0]) {
              this.customerName = list[0]['company_name'];
            }
            this.paymentList = list;
            this.dataSource = new MatTableDataSource(list);
            this.dataSource.sort = this.sort;
            this.getFooterTotal();
          });
        }
      }
    )
  }

  printTxn() {
    this.showTxn = true;
  }

  reload() {
    window.location.reload();
  }

  getFooterTotal() {
    for(let j=0; j< this.paymentList.length; j++) {
      let credit = Number (this.paymentList[j]['credit']);
      let debit = Number (this.paymentList[j]['debit']);
      this.creditTotal = this.creditTotal + credit;
      this.debitTotal = this.debitTotal + debit;
    }
    if(this.paymentList.length > 0){
    this.paymentList[0]['creditTotal'] = this.creditTotal;
    this.paymentList[0]['debitTotal'] = this.debitTotal;
    this.showPrint = false;
    } else {
      this.showPrint = true;
    }
  }
  
  filter(name: string): User[] {
    return this.userOptions.filter(
      (option) => option.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  displayFn(user: User): string {
    return user ? user.name : '';
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  handleEmptyInput(event: any) {
    let name : string = event.target.value;
    if (event.target.value === '') {
      this.submitFlag = true;
      this.billForm.controls['customerId'].setValue(0);
    } 
    else {
      let filterList = this.userOptions.filter(option => option.name.toLowerCase().includes(name.toLowerCase));
      if(filterList.length == 0) {
        this.submitFlag = true;
        this.billForm.controls['customerId'].setValue(0);
      }
    }
  }

  updateCompanyInfo(event: any) {
    this.submitFlag = false;
    this.billForm.controls['customerId'].setValue(event.option.value["value"]['customerId']);
  }

  search(){
    if(!this.billForm.valid){
      return;
    } else {
    this.creditTotal = 0;
    this.debitTotal = 0;
    let res = this.userService.getClientPaymentData(this.billForm.getRawValue());
    res.subscribe(
      list=>{
        if(list[0]){
          this.customerName = list[0]['company_name'];
        }
        this.paymentList = list;
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.sort = this.sort;
        this.getFooterTotal();
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditDialog(){
    this.dialog.open(PaymentDialogComponent, {
      data:{
        id: this.billForm.controls['customerId'].value,
        pending: this.debitTotal - this.creditTotal
      }
    });
  }
}
