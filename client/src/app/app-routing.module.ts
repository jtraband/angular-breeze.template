
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AuthGuardService } from './core/auth-guard.service';
import { CanDeactivateGuard } from './core/can-deactivate-guard.service';
import { CoreModule } from './core/core.module';

import { EntityManagerProviderGuard } from './core/entity-manager-guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login.component';
import { CustomersComponent } from './home/customers.component';
import { DbContextResolver } from './core/db-context-resolver';


// helpId values come from WebHelp/js/topic-table.js
const appRoutes: Routes = [
  {
    path: 'login',
    data: { title: 'Login' },
    component: LoginComponent
  }, {
    path: 'home',
    data: { title: 'Home' },
    component: HomeComponent,
    canActivate: [AuthGuardService, EntityManagerProviderGuard],
  }, {
    path: 'customers',
    data: { title: 'Customers'},
    component: CustomersComponent,
    resolve: { dbContext: DbContextResolver },
    canActivate: [AuthGuardService, EntityManagerProviderGuard],
  },
  //  {
  //   path: 'auction-edit/:company/:site/:id',
  //   data: { feature: FeatureInsightEnum.Auction, title: 'Auction Edit', helpId: 470 },
  //   component: AuctionEditComponent,
  //   resolve: { dbContext: DbSiteResolver },
  //   canActivate: [AuthGuardService, EntityManagerProviderGuard],
  //   canDeactivate: [CanDeactivateGuard]
  // },
  {
    path: '**',
    data: { title: 'Home' },
    component: HomeComponent,
    canActivate: [AuthGuardService, EntityManagerProviderGuard],
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    CoreModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
