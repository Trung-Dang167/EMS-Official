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
    interval(30000).subscribe(() => {
      this.getChartData(); // Lấy dữ liệu mỗi 30 giây
    });
  }

  getChartData() {
    this.srv.getStat().subscribe({
      next: (res) => {
        this.dataSource = res;
        if (!this.chart){
          this.initializeChart(this.selectedValue); //Tạo biểu đồ ban đầu
        } else {
          this.updateChart(this.selectedValue); //Cập nhật biểu đồ
        }
      }
    });
  }

  onSelectChange(event: any) {
    const selectedValue = event.target.value;
    this.initializeChart(selectedValue); //Cập nhật biểu đồ khi có sự thay đổi lưạ chọn
  }

  initializeChart(selectedValue: string): void {
    if (this.chart){
      this.chart.destroy();
    }
    const filteredData = this.dataSource.filter(item => item.name === selectedValue);
    const labels = filteredData.map(item => item.time);
    const data = filteredData.map(item => parseFloat(item.value));
    const alarm = filteredData.map(item => parseFloat(item.alarmValue));
    const unit = filteredData.map(item => item.unit);
    const maxRange = filteredData.map(item => parseFloat(item.maxValue));
    const minRange = filteredData.map(item => parseFloat(item.minValue));

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
          label: 'Alarm Setting',
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

  updateChart(selectedValue: string): void{
    console.log("Update Chart Called!");
    const filteredData = this.dataSource.filter(item => item.name === selectedValue);
    const labels = filteredData.map(item => item.time);
    const data = filteredData.map(item => parseFloat(item.value));
    const alarm = filteredData.map(item => parseFloat(item.alarmValue));

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[1].data = alarm;

    this.chart.update(); // Cập nhật biểu đồ
  }
  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
