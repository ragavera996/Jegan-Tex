import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BillTable } from 'src/billTable';
import { User } from '../add-bill/add-bill.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage-bills',
  templateUrl: './manage-bills.component.html',
  styleUrls: ['./manage-bills.component.css']
})
export class ManageBillsComponent implements OnInit {
  filteredOptions: Observable<User[]>;
  currentPdfName: string;
  userOptions = [];
  billForm: FormGroup;
  customer_list: any;
  template_list: any;
  displayFalse: boolean = false;
  showTemplate: boolean = false;
  showEdit: boolean = false;
  showBill: boolean = true;
  displayedColumns = ['bill_number', 'company_name', 'total_amount', 'date', 'actions'];
  public myControl = new FormControl();

  @ViewChild(MatSort) sort: MatSort;

  billData: MatTableDataSource<BillTable>;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private dialog: MatDialog) { }


  ngOnInit() {
    this.billForm = this.formBuilder.group({
      billNumber: new FormControl('', []),
      amount: new FormControl('', []),
      myControl: new FormControl('', []),
      customerId: new FormControl('', []),
      autoComplete: new FormControl('', []),
      start: new FormControl('', []),
      end: new FormControl('',[])
    });
    this.billData = new MatTableDataSource();
    this.userService.getCustomersData().subscribe({
      next: list => { (this.customer_list = list) },
      complete: () => {
        for (let i = 0; i < this.customer_list.length; i++) {
          this.userOptions.push(new User(this.customer_list[i]['company_name'], this.customer_list[i]));
        }

      }
    });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith({} as User),
        map(user => user && typeof user === 'object' ? user.name : user),
        map((name: string) => name ? this.filter(name) : this.userOptions.slice())
      );
      this.loadData();
  }

  printPdf(billNumber: string) {
    this.userService.getPdf(billNumber)
    .subscribe((data: any) => {
      this.template_list = data;
      this.showTemplate = true;
      this.showBill = false;
      this.showEdit = false;
    });
  }

  filter(name: string): User[] {
    return this.userOptions.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  displayFn(user: User): string {
    return user ? user.name : '';
  }

  handleEmptyInput(event: any) {
    if (event.target.value === '') {
      this.billForm.controls['customerId'].setValue(0);
    }
  }

  reload() {
    window.location.reload();
  }

  updateCompanyInfo(event: any) {
    this.billForm.controls['customerId'].setValue(event.option.value["value"]['customerId']);
  }

  loadData() {
    let res = this.userService.getBillData(this.billForm.getRawValue());
    res.subscribe(
      list => {
        this.billData = new MatTableDataSource(list);
        this.billData.sort = this.sort;
      });
  }

  search() {
    if (!this.billForm.valid) {
      return;
    }
      this.loadData();
  }

  openDialog(id) {
    this.dialog.open(AlertDialogComponent, {
      data: {
        id: id
      }
    });
  }

  openEdit(billNumber: string) {
    this.userService.getPdf(billNumber)
    .subscribe((data: any) => {
      this.template_list = data;
      this.showTemplate = false;
      this.showBill = false;
      this.showEdit = true;
    });
  }

}

