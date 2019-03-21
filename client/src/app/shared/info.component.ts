import { Component, Input } from '@angular/core';

/**
 * Display an information icon with tooltip.
 */

@Component({
  selector: 'app-info',
  template: '<img *ngIf="!!tip" src="assets/images/Info.png" height="20" width="20" class="my-auto ml-1" [tooltip]="tip">'
})
export class InfoComponent {
  @Input() tip: string;

  constructor() { }
}
