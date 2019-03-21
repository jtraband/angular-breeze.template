import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { DialogService } from './core/dialog.service';
import { ToastComponent } from './core/toast.component';
import { ValidationErrorsModalComponent } from './core/validation-errors.modal.component';
import { YesNoModalComponent } from './core/yes-no-modal.component';
import { BusyService } from './core/busy.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Space Control';
  @ViewChild(YesNoModalComponent) public yesNoModal: YesNoModalComponent;
  @ViewChild(ValidationErrorsModalComponent) validationErrorsModal: ValidationErrorsModalComponent;
  @ViewChild(ToastComponent) toastComponent: ToastComponent;

  constructor(private _dialogService: DialogService, public busyService: BusyService, private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) {
  }

  ngOnInit() {
    this._dialogService.yesNoModal = this.yesNoModal;
    this._dialogService.validationErrorsModal = this.validationErrorsModal;
    this._dialogService.toastComponent = this.toastComponent;

    this.subscribeTitles();
  }

  subscribeTitles() {
    // when navigation ends, set the page title to the title data in the route
    // full explanation at https://toddmotto.com/dynamic-page-titles-angular-2-router-events
    this.router.events
    .filter((event) => event instanceof NavigationEnd)
    .map(() => this.activatedRoute)
    .map((route) => {
      while (route.firstChild) { route = route.firstChild; }
      return route;
    })
    .filter((route) => route.outlet === 'primary')
    .mergeMap((route) => route.data)
    .subscribe((event) => {
      const title = 'SC Insight' + (event['title'] ? ' | ' + event['title'] : '');
      this.titleService.setTitle(title);
    });
  }

}
