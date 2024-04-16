import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Data } from './settingInfo';
import { ServerService } from '../shared/server.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RangeModificationComponent } from './range-modification/range-modification.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})

export class SettingComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  public displayColumns: string[] = ['tag', 'name', 'maxValue', 'alarmValue', 'action'];
  dataSource!: MatTableDataSource<Data>;

  constructor(
    private data$: ServerService, 
    private _dialog: MatDialog,
    private translate: TranslateService) {
      translate.setDefaultLang('vi');
      translate.use('vi');
    }

  ngOnInit(): void {
    this. getSettingInfo()
  }

  ngAfterViewInit(): void {
    if (this.sort && this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getSettingInfo() {
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

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(RangeModificationComponent, {
      data,
      height: '370px',
      width: '450px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {
          this.getSettingInfo();
        }
      },
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
}
}
