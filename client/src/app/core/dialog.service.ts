import { ToastComponent, ToastConfig } from './toast.component';
import { YesNoModalComponent, YesNoResult } from './yes-no-modal.component';
import { ValidationErrorsModalComponent } from './validation-errors.modal.component';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  // this value is set from outside by the AppRootComponent
  validationErrorsModal: ValidationErrorsModalComponent;
  yesNoModal: YesNoModalComponent;
  toastComponent: ToastComponent;

  constructor(  ) {

  }

  /** 0 = Save, 1 = Don't Save, 2 = Cancel (Remain on page) */
  promptToSave(): Promise<YesNoResult> {
    return this.askYesNo('You have unsaved changes', 'Click <b>Save</b> to save your changes.<br>' +
      'Click <b>Don\'t Save</b> to discard your changes.<br>Click <b>Cancel</b> to remain on this page.',
    ['Save', 'Don\'t Save', 'Cancel']);
  }

  askYesNo(title: string, message: string, buttonNames?: string []): Promise<YesNoResult> {
    return this.yesNoModal.showModal(title, message, buttonNames);
  }

  showValidationErrors(entityErrors: any[]) {
    this.validationErrorsModal.show('Validation Errors - Not Saved', entityErrors);
  }

  toast(config: ToastConfig | string) {
    if (typeof config === 'string') {
      config = {
        message: config
      }
    }
    this.toastComponent.show(config);
  }

}
