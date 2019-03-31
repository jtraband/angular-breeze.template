import { UnitOfWork } from './../core/unit-of-work';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RangeFns } from '../core/range-fns';
import { DomainService } from './../core/domain.service';
import { Customer } from '../model/entities/NorthwindIB/entity-model';


import * as _ from 'lodash'
import { DomainBaseComponent } from '../core/domain-base.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  // encapsulation: ViewEncapsulation.None
})
export class CustomersComponent extends DomainBaseComponent implements OnInit {
  private uow: UnitOfWork;
  customers: Customer[];
  colDefs: object[];
  constructor(protected _domainService: DomainService, protected _route: ActivatedRoute) {
    super(_domainService);
    this.colDefs = [
      {headerName: 'Id', field: 'customerID'},
      {headerName: 'Company Name', field: 'companyName'},
      {headerName: 'Address', field: 'address'},
      {headerName: 'City', field: 'city'},
    ];

  }

  ngOnInit() {
    this.uow = this._dbContextService.currentUow
    this.executeQuery().then(() => {
      this.isPageReady = true;
    });
  }

  executeQuery() {
    const p1 = this.uow.getAllOrQuery(Customer, 'Customers');
    p1.then(r => this.customers = r);
    return p1;
  }


  save() {
    return this.uow.manager.saveChanges();
  }

  goBack() {
    this._router.navigate(['/home' ]);
  }
}

