import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ServerService } from '../shared/server.service';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-statistics-list',
  templateUrl: './statistics-list.component.html',
  styleUrls: ['./statistics-list.component.scss']
})
export class StatisticsListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  chart: any;
  dataSource!: any[];
  selectedValue: string = 'Flow';
  values: string[] = ['Flow', 'Pressure', 'O2', 'CO', 'NOx', 'SO2', 'HCl', 'Dust', 'H20', 'Temperature'];
  @ViewChild('lineChart', { static: true }) chartCanvas!: ElementRef;

  constructor(private srv: ServerService, private translate: TranslateService) {
    translate.setDefaultLang('vi');
    translate.use('vi');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.getChartData();
    interval(30000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getChartData();
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  getChartData() {
    console.log('getChartData called:');
    this.srv.getStat().subscribe({
      next: (res) => {
        this.dataSource = res;
        console.log('DataSource in getChartData:');
        if (!this.chart){
          this.initializeChart(this.selectedValue); //Tạo biểu đồ ban đầu
        } else {
          this.updateChart(this.selectedValue); //Cập nhật biểu đồ
        }
      },
      error: (error) => {
        console.error('Error fetching trend data:', error);
        // Handle error (e.g., display error message to user)
      }
    });
  }
  
  onSelectChange() {
    console.log('onSelectChange called');
    this.initializeChart(this.selectedValue);
  }

  initializeChart(selectedValue: string): void {
    console.log('initializeChart called');
    if (this.chart){
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const filteredData = this.dataSource ? this.dataSource.filter(item => item.name === selectedValue) : [];
    const labels = filteredData.map(item => item.time);
    const data = filteredData.map(item => parseFloat(item.value));
    const alarm = filteredData.map(item => parseFloat(item.alarmValue));
    const unit = filteredData.map(item => item.unit);
    const maxRange = filteredData.map(item => parseFloat(item.maxValue));
    const minRange = filteredData.map(item => parseFloat(item.minValue));

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
        maintainAspectRatio: false,
        aspectRatio: 0.5,
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
  
  updateChart(selectedValue: string): void {
    console.log("Update Chart Called!");
    const filteredData = this.dataSource ? this.dataSource.filter(item => item.name === selectedValue) : [];
    const labels = filteredData.map(item => item.time);
    const data = filteredData.map(item => parseFloat(item.value));
    const alarm = filteredData.map(item => parseFloat(item.alarmValue));

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[1].data = alarm;

    this.chart.update();
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
