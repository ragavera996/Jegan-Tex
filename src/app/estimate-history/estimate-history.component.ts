import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { BillTable } from 'src/billTable';
import { User } from '../add-bill/add-bill.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-estimate-history',
  templateUrl: './estimate-history.component.html',
  styleUrls: ['./estimate-history.component.css']
})
export class EstimateHistoryComponent implements OnInit {
  template_list: any;
  showTemplate: boolean = false;
  billForm: FormGroup;
  userOptions = [];
  displayedColumns = ['bill_number', 'company_name', 'total_amount', 'date', 'actions'];
  @ViewChild(MatSort) sort: MatSort;

  billData: MatTableDataSource<BillTable>;
  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
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
    this.loadEstimateData();
  }

  search() {
    if (!this.billForm.valid) {
      return;
    }
      this.loadEstimateData();
  }

  loadEstimateData() {
    let res = this.userService.getEstimateBillData(this.billForm.getRawValue());
    res.subscribe(
      list => {
        this.billData = new MatTableDataSource(list);
        this.billData.sort = this.sort;
      });
  }

  printPdf(billNumber: string) {
    this.userService.getEstimatePdf(billNumber)
    .subscribe((data: any) => {
      this.template_list = data;
      this.showTemplate = true;
    });
  }
}
