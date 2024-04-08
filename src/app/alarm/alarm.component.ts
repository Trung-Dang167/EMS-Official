import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { alarmData } from './alarmInfo';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { io, Socket } from 'socket.io-client';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss']
})
export class AlarmComponent implements OnInit {
  // dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  // filteredData: any;
  displayColumns: string[] = ['tag', 'name', 'status', 'time'];
  // displayColumns: string[] = ['tag', 'name', 'status', 'time', 'errorConfirmed'];

  // unfilteredData: any;
  dataSource!: MatTableDataSource<any>;
  private socket!: Socket;

  constructor(
    private data: ServerService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('vi');
    translate.use('vi');
  }

  ngOnInit(): void {
    this.getAlarmData();
    this.connectWebSocket();
  }

  getRowClass(status: string, ack: boolean):string {
    if (ack){
      return 'ack-row';
    } else{
      switch (status) {
        case 'High':
          return 'alarm-color';
        default:
          return 'system-color';
      }
    }
  }

  getAlarmData() {
    this.data.getAlarm().subscribe(res => {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.sort = this.sort
    })
  }

  connectWebSocket() {
    console.log('Connected WebSocket for Alarm Data');
    this.socket = io('http://localhost:3000');
    this.socket.on('alarm', (newAlarmData) => {
      // Cập nhật dataSource với dữ liệu mới
      this.dataSource.data = newAlarmData;
      // console.log("New DataSource data:",this.dataSource.data );
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  onCheckboxChange(event: any, data: any) {
    // Xử lý logic khi checkbox được thay đổi ở đây
  }
  
}
