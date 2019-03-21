import { AuthService } from './../core/auth.service';
import { Router } from '@angular/router';
import { DbContext, DbContextService } from './../core/db-context.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
  dbContext: DbContext;
  constructor(private _dbcService: DbContextService, private _authService: AuthService, private _router: Router) {
    this.dbContext = _dbcService.currentDbContext;
  }

  ngOnInit() { }

  get user() {
    return this._authService.getUser();
  }

  navigateHome() {
    this._router.navigate(['/home']);
  }

  navigateRates() {
    this._router.navigate(['/rate-site-selector', this.user.companyCode]);
  }

  navigateReports() {
    this._router.navigate(['/report-management-summary', this.user.companyCode, 0, 'All']);
  }
}
