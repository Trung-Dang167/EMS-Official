import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService { // Rename the class to SocketService
  private socket$: WebSocketSubject<any>;

  constructor() {
    // Thiết lập kết nối WebSocket tới /dashboard trên máy chủ
    this.socket$ = webSocket('ws://localhost:3000');
  }

  // Gửi dữ liệu lên server thông qua kết nối WebSocket
  sendData(data: any): void {
    this.socket$.next(data);
  }

  // Lắng nghe dữ liệu từ server thông qua kết nối WebSocket
  receiveData(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Đóng kết nối WebSocket
  disconnect(): void {
    this.socket$.complete();
  }
}
