import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Data } from './dashboardInfo';
import { ServerService } from '../shared/server.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit, AfterViewInit  {

  @ViewChild(MatSort) sort!: MatSort;

  displayColumns: string[] = ['tag', 'name', 'realtimeValue', 'unit', 'status', 'alarmStatus'];
  dataSource!: MatTableDataSource<Data>;
  userRoleStatus!: string;
  private socket!: Socket;

  constructor(
    private data$: ServerService,
    private _dialog: MatDialog,
    private translate: TranslateService) {
      translate.setDefaultLang('vi');
      translate.use('vi');
    }

  ngOnInit(): void {
    this.getDashboardInfo();
    this.connectWebSocket();
  }

  ngAfterViewInit(): void {
    if (this.sort && this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getRowClass(status: string) {
    switch (status) {
      case 'Error':
        return 'error-row';
      case 'Calib':
        return 'calib-row';
      default:
        return 'normal-row';
    }
  }

  getStatusAlarm(status: string){
    switch (status){
      case 'High':
        return 'high-alarm';
      default:
        return 'normal-alarm';
    }
  }

  getDashboardInfo() {
    this.data$.getData().subscribe({
      next: (res) => {
        // Sắp xếp mảng res dựa trên thuộc tính order
        res.sort((a, b) => a.order - b.order);
        
        this.dataSource = new MatTableDataSource(res);
  
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      }
    });
  }

  connectWebSocket() {
    console.log('Attempting to connect WebSocket for Dashboard Data');
    try {
      this.socket = io('http://localhost:3000');
      this.socket.on('data', (realtimeData: Data[]) => { // Specify the type of realtimeData as Data[]
        this.dataSource.data = this.dataSource.data.map((item: Data) => {
          const newData: Data = realtimeData.find((d: Data) => d.tag === item.tag) || item;
          return newData;
        });
      });
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      // Handle error (e.g., display error message to user)
    }
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
