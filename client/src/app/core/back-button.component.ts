import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  template: '<div style="position: absolute; left:10px;" class="no-print">' +
        '<button (click)="click()" class="btn btn-sm btn-primary">' +
        '<i class="fa fa-arrow-left"></i> Back</button></div>'
})

export class BackButtonComponent {
  @Input() parent: any;

  constructor(public location: Location) { }

  click() {
    if (this.parent && this.parent.goBack) {
      this.parent.goBack();
    } else {
      this.location.back();
    }
  }
}
