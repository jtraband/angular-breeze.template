import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-validation-errors-modal',
  templateUrl: './validation-errors.modal.component.html'
})
export class ValidationErrorsModalComponent {
  @ViewChild('validationErrorsModal') public validationErrorsModal: ModalDirective;
  title: string;
  entityErrors: any[];

  show(title: string, entityErrors: any[]): Promise<any> {
    this.title = title;
    this.entityErrors = entityErrors;
    this.validationErrorsModal.show();
    const p = new Promise( (resolve, reject) => {
      const s = this.validationErrorsModal.onHide.subscribe( () => {
        s.unsubscribe();
        resolve(null);
      });
    });
    return p;
  }

  close() {
    this.validationErrorsModal.hide();
  }


}
