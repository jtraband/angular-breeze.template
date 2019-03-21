import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';
import { DxToastModule } from 'devextreme-angular/ui/toast';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AuthGuardService } from './auth-guard.service';
import { AuthHttpInterceptor } from './auth-http-interceptor';
import { BackButtonComponent } from './back-button.component';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { DomainService } from './domain.service';
import { EditPropComponent } from './edit-prop.component';
import { EntityManagerProviderGuard } from './entity-manager-guard';
import { ErrorLogger } from './error-logger';
import { ToastComponent } from './toast.component';
import { ValidationErrorsModalComponent } from './validation-errors.modal.component';
import { YesNoModalComponent } from './yes-no-modal.component';
import { BusyService } from './busy.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    BreezeBridgeHttpClientModule,
    DxToastModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    EditPropComponent,
    YesNoModalComponent,
    ValidationErrorsModalComponent,
    ToastComponent,
    BackButtonComponent
  ],
  declarations: [
    EditPropComponent,
    YesNoModalComponent,
    ValidationErrorsModalComponent,
    ToastComponent,
    BackButtonComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    BusyService,
    DomainService,
    AuthGuardService,
    CanDeactivateGuard,
    EntityManagerProviderGuard,
    ErrorLogger,
  ],
})
export class CoreModule { }
