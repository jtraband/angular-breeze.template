import { MessageBus } from './message-bus';
import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';

export interface ToastConfig {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success',
  displayTime?: number;
  visible?: boolean;
}

@Component({
  selector: 'app-toast',
  template: `
    <dx-toast *ngIf="config"
        [message]="config.message"
        [type]="config.type"
        [displayTime]="config.displayTime"
        [(visible)]="config.visible">
    </dx-toast>
  `
})
export class ToastComponent implements OnInit, OnDestroy {
  config: ToastConfig;
  subscription: Subscription;

  ngOnInit() {
    this.subscription = MessageBus.messages.subscribe(msg => {
      if (msg && msg.type) {
        this.show(msg);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  show(config: ToastConfig) {
    config.message = config.message || '...';
    config.type = config.type || 'info';
    config.displayTime = config.displayTime || (config.type === 'error' ? 4000 : 2000);
    config.visible = true;
    this.config = config;
  }

}

