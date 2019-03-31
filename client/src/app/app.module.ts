import { CustomersComponent } from './home/customers.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { AgGridModule } from 'ag-grid-angular';

import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxRadioGroupModule } from 'devextreme-angular/ui/radio-group';
import { DxSwitchModule } from 'devextreme-angular/ui/switch';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthService } from './core/auth.service';
import { CoreModule } from './core/core.module';
import { DbContextResolver } from './core/db-context-resolver';
import { DbContextService } from './core/db-context.service';
import { DialogService } from './core/dialog.service';
import { NorthwindIBManagerProvider } from './core/entity-manager-provider';

import { HeaderComponent } from './home/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login.component';

import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    CustomersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,

    CoreModule,
    SharedModule,
    AppRoutingModule,

    AgGridModule.withComponents([]),

    DxDataGridModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
    DxListModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxRadioGroupModule,
    DxSwitchModule,
    DxPopupModule,
    DxLoadPanelModule,

    TooltipModule.forRoot(),
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    DbContextResolver,
    DbContextService,
    NorthwindIBManagerProvider,
    AuthService,
    DialogService,
    Title,
    { provide: TooltipConfig, useFactory: getTooltipConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getTooltipConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), { placement: 'right', container: 'body' });
}
