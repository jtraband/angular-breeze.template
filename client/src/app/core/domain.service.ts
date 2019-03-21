import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { DbContextService } from './db-context.service';
import { DialogService } from './dialog.service';
import { ErrorLogger } from './error-logger';
import { BusyService } from './busy.service';


@Injectable()
export class DomainService {

  constructor(public dbContextService: DbContextService, public authService: AuthService,
    public dialogService: DialogService,  public errorLogger: ErrorLogger, public busyService: BusyService,
    public router: Router, public location: Location ) {
      // Note: can't include ActivatedRoute or ElementRef here
  }

}
