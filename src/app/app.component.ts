import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import { SocketService } from './shared/socket.service';
import { Socket, Manager, SocketOptions } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private socket!: Socket;
  title = 'EmissionMonitoringSystem';
  //realTimeData: any;
  data: any;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('vi');
    translate.use('vi');
  }

  ngOnInit(): void {
    // Kết nối tới máy chủ WebSocket
    const manager = new Manager('http://localhost:3000');
    this.socket = new Socket(manager, '/', {} as Partial<SocketOptions>);

    // Lắng nghe sự kiện 'data' từ máy chủ WebSocket và cập nhật dữ liệu real-time
    this.socket.on('data', (data) => {
      this.data = data;
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.socket.disconnect();
  }
}
