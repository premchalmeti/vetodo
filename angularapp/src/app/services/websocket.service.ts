import { Injectable } from '@angular/core';
import { Subject, Observable, Observer} from 'rxjs';
import { environment } from '../../environments/environment';

const WS_URL = environment.wsEndpoint;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor() {}

  public subject: Subject<MessageEvent>;

  public connect(): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(WS_URL);
      console.log('Successfully connected: ' + WS_URL);
    }
    return this.subject;
  }

  private create(url: string): Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };
    return Subject.create(observer, observable);
  }
}
