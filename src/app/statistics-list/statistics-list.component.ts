import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto'
import { ServerService } from '../shared/server.service';
import { TranslateService } from '@ngx-translate/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-statistics-list',
  templateUrl: './statistics-list.component.html',
  styleUrls: ['./statistics-list.component.scss']
})
export class StatisticsListComponent implements OnInit {
  chart: any;
  dataSource!: any[];
  selectedValue: string = 'Flow';// Khởi tạo giá trị mặc định cho selectedValue
  values: string[] = ['Flow', 'Pressure', 'O2', 'CO', 'NOx', 'SO2', 'HCl', 'Dust', 'H20', 'Temperature'];
  @ViewChild('lineChart') chartCanvas!: ElementRef;

  constructor(private srv: ServerService, private translate: TranslateService) {
    translate.setDefaultLang('vi');
    translate.use('vi');
  }

  ngOnInit(): void {
    this.getChartData();// Lấy dữ liệu lần đầu tiên
    this.startAutoUpdate();//Bắt đầu cập nhật tự động
  }

  getChartData() {

    this.srv.getStat().subscribe({
      next: (res) => {
        this.dataSource = res;
        this.initializeChart(this.selectedValue);
      }
    })
  }

  onSelectChange(event: any) {
    const selectedValue = event.target.value;
    this.initializeChart(selectedValue);
  }

  startAutoUpdate(): void {
    // Sử dụng interval để gọi lại hàm getChartData sau mỗi khoảng thời gian
    interval(30000).subscribe(() => {
      this.getChartData();
    });
  }

  initializeChart(selectedValue: string): void {
        // Hủy bỏ biểu đồ cũ trước khi tạo biểu đồ mới
    if (this.chart) {
      console.log('Chrt destroy!')
      this.chart.destroy();
    }
    const filteredData = this.dataSource.filter(item => item.name === selectedValue);
    const labels = filteredData.map(item => item.time);
    const data = filteredData.map(item => parseFloat(item.value));
    const alarm = filteredData.map(item => parseFloat(item.alarmValue));
    const unit = filteredData.map(item => item.unit);
    const maxRange = filteredData.map(item => parseFloat(item.maxValue));
    const minRange = filteredData.map(item => parseFloat(item.minValue));
    console.log('selectedValue', selectedValue);
    // console.log('Value:', data);
    // console.log('Unit:', unit);
    // console.log('Alarm Value:', alarm);
    // console.log('MaxValue:',maxRange[0]);
    // console.log('MinValue:',minRange[0]);

    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: selectedValue,
          data: data,
          fill: false,
          borderColor: 'blue',
          borderWidth: 1.5
        },
        {
          label: 'Alarm',
          data: alarm,
          fill: false,
          borderColor: 'red',
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to adjust both width and height
        aspectRatio: 0.5, // You can adjust this value to control the aspect ratio of the chart
        scales: {
          y: {
            title: {
              display: true,
              text: unit[0]
            },
            max: maxRange[0],
            min: minRange[0]
          }
        }
      }
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}









