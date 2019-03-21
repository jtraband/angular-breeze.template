import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

export interface YesNoResult {
  button: string;
  index: number;
}

@Component({
  selector: 'app-yes-no-modal',
  templateUrl: './yes-no-modal.component.html'
})
export class YesNoModalComponent implements OnInit {
  @ViewChild('yesNoModal') public modal: ModalDirective;

  _title: string;
  _message: string;
  _buttonNames: string[];
  _result: YesNoResult;

  ngOnInit() {

  }

  select(index: number) {
    if (index >= 0) {
      this._result = {
        button: this._buttonNames[index],
        index: index
      };
    }
    this.hide();
  }

  showModal(title: string, message: string, buttonNames?: string[]): Promise<YesNoResult> {
    this._title = title;
    this._message = message;
    buttonNames = buttonNames || ['Yes', 'No'];
    this._buttonNames = buttonNames;
    this._result = {
      button: buttonNames[buttonNames.length - 1],
      index: buttonNames.length - 1
    };
    const p = new Promise<YesNoResult>((resolve, reject) => {
      this.modal.show();
      const s = this.modal.onHide.subscribe(() => {
        s.unsubscribe();
        resolve(this._result);
      });
    });
    return p;
  }

  hide(): void {
    this.modal.hide();
  }


}

