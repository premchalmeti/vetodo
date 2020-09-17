import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { WebsocketService } from './services/websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private webSocketService: WebsocketService) {
    this.webSocketService.connect();
  }

  ngOnInit() {}
}
