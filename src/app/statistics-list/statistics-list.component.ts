import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Chart } from 'chart.js/auto';
import { ServerService } from '../shared/server.service';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-statistics-list',
  templateUrl: './statistics-list.component.html',
  styleUrls: ['./statistics-list.component.scss']
})
export class StatisticsListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  chart: any;
  dataSource!: any[];
  selectedValue: string = 'H20';
  values: string[] = ['H20', 'HCl', 'SO2', 'NOx', 'CO', 'O2', 'Pressure', 'Temperature', 'Flow', 'Dust'];
  @ViewChild('lineChart', { static: true }) chartCanvas!: ElementRef;

  constructor(private srv: ServerService, private translate: TranslateService) {
    translate.setDefaultLang('vi');
    translate.use('vi');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.getChartData();
    interval(60000)
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
        console.log('DataSource in getChartData', this.dataSource);
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
    
    const chartData = filteredData.map(item => ({
      time: item.time,
      value: parseFloat(item.value),
      alarmValue: parseFloat(item.alarmValue),
      unit: item.unit,
      maxValue: parseFloat(item.maxValue),
      minValue: parseFloat(item.minValue)
    }));
  
    const labels = chartData.map(item => item.time);
    const data = chartData.map(item => item.value);
    const alarm = chartData.map(item => item.alarmValue);
    const unit = chartData.length > 0 ? chartData[0].unit : '';
    const maxRange = chartData.length > 0 ? chartData[0].maxValue : undefined;
    // const minRange = chartData.length > 0 ? chartData[0].minValue : undefined;
    const minRange = 0;
    console.log('Labels:', labels);
    console.log('Data:', data);
    console.log('Alarm:', alarm);
    console.log('Unit:', unit);
    console.log('Max:', maxRange);
    console.log('Min:', minRange);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: selectedValue,
          data: data,
          fill: false,
          borderColor: 'blue',
          pointBackgroundColor: 'blue',
          borderWidth: 1.2,
          pointRadius: 1.0,
          cubicInterpolationMode: 'monotone'
        },
        {
          label: 'Alarm Setting',
          data: alarm,
          fill: false,
          borderColor: 'red',
          pointBackgroundColor: 'red',
          borderWidth: 1.2,
          pointRadius: 1.0,
          cubicInterpolationMode: 'monotone'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'dd'
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: unit
            },
            max: maxRange,
            min: minRange
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
