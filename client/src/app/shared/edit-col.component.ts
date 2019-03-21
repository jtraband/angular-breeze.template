import { Component, Input } from '@angular/core';

/**
 * Put a dx-text-box or other content into a row with optional information icon.
 * The <div class="row"> element is needed to keep the textbox and icon on the same row.
 * Should have a col-* class applied when used.  E.g.:
  <app-edit-col class="col-md-6" tip="something to say">
    <dx-text-box [(value)]="firstName"></dx-text-box>
  </app-edit-col>
 */

@Component({
  selector: 'app-edit-col',
  template: '<div class="row">' +
              '<ng-content></ng-content>' +
              '<img *ngIf="!!tip" src="assets/images/Info.png" height="20" width="20" class="my-auto ml-1" [tooltip]="tip" [placement]="placement">' +
            '</div>'
})
export class EditColComponent {
  @Input() tip: string;
  @Input() placement = 'right';

  constructor() { }
}
