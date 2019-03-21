import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IMessage {
    from?: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
}

export class MessageBus {
  private static messageSubject = new BehaviorSubject<IMessage>(null);

  public static notify(message: IMessage) {
    this.messageSubject.next(message);
  }

  public static get messages() {
    return this.messageSubject.asObservable();
  }
}
