import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CoreModule } from '../core/core.module';
import { EditColComponent } from './edit-col.component';
import { InfoComponent } from './info.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    DxDataGridModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,

    TooltipModule.forRoot(),

    CoreModule
  ],
  exports: [
    EditColComponent,
    InfoComponent,
  ],
  declarations: [
    EditColComponent,
    InfoComponent,
  ],
  providers: [

  ],
})
export class SharedModule { }
