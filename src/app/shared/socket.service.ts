import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService { // Rename the class to SocketService
  private socket$: any;

  constructor() {
    this.socket$ = io('ws://localhost:3000');
  }

  listen(Eventname: string) {
    return new Observable((subcriber) => {
      this.socket$.on(Eventname, (data: any) => {
        subcriber.next(data)
      })
    })
  }
}
