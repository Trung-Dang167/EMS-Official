import { Component, OnInit, ViewChild } from '@angular/core';
import { Data } from './dashboardInfo';
import { ServerService } from '../shared/server.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModifyDashboardComponent } from './modify-dashboard/modify-dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;

  displayColumns: string[] = ['tag', 'name', 'realtimeValue', 'unit', 'status', 'alarmStatus'];
  dataSource!: MatTableDataSource<any>
  userRoleStatus!: string;
  private socket!: Socket;

  constructor(
    private data$: ServerService,
    private _dialog: MatDialog,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('vi');
    translate.use('vi');
  }

  ngOnInit(): void {
    this.getDashboardInfo();
    this.connectWebSocket();
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
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.sort = this.sort
      },
    })
  }

  connectWebSocket() {
    console.log('Connected WebSocket for Dashboard Data');
    this.socket = io('http://localhost:3000');
    this.socket.on('data', (realtimeData: Data[]) => {
      if (Array.isArray(this.dataSource.data)) {
        this.dataSource.data = this.dataSource.data.map((item: Data) => {
          const newData: Data = realtimeData.find((d: Data) => d.tag === item.tag) || item;
          return newData;
        });
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(ModifyDashboardComponent, {
      data,
      height: '450px',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getDashboardInfo();
        }
      },
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
