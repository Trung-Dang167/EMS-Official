import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto'
import { ServerService } from '../shared/server.service';
import { TranslateService } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';
import { SocketService } from '../shared/socket.service';
import { chartData } from './chartData';


@Component({
  selector: 'app-statistics-list',
  templateUrl: './statistics-list.component.html',
  styleUrls: ['./statistics-list.component.scss']
})
export class StatisticsListComponent implements OnInit {
  chart: any;
  private socket!: Socket;
  private dataSource!: any
  @ViewChild('realtimeChart') chartCanvas!: ElementRef;


  constructor(private srv: ServerService,
    private data: SocketService,
    private translate: TranslateService) {
    translate.setDefaultLang('vi');
    translate.use('vi');
  }

  ngOnInit(): void {
    this.getChartData()
    this.connectWebSocket()
    //this.initializeChart();
  }

  getChartData() {
    this.srv.getStat().subscribe({
      next: (res) => {
        this.dataSource = res;
      }
    })
  }

  connectWebSocket() {
    this.socket = io('http://localhost:3000');
    this.socket.on('stat', (realtimeData: chartData[]) => {

    });
  }

  initializeChart(): void {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysOfWeek,
        datasets: [{
          label: 'Flue gas O2', // tag name
          data: this.dataSource.gas_o2, // realtimeValue
          fill: false,
          borderColor: 'red',
          borderWidth: 1,
          showLine: false,
          tension: 0
        },
        {
          label: 'Flue gas CO',
          data: this.dataSource.gas_co,
          fill: false,
          borderColor: 'black',
          borderWidth: 1,
          showLine: true,
          tension: 0
        },
        {
          label: 'Flue gas NOx',
          data: this.dataSource.gas_nox,
          fill: false,
          borderColor: 'blue',
          borderWidth: 1,
          showLine: true,
          tension: 0
        },
        {
          label: 'Flue gas SO2',
          data: this.dataSource.gas_so2,
          fill: false,
          borderColor: 'purple',
          borderWidth: 1,
          showLine: true,
          tension: 0
        },
        {
          label: 'Flue gas HCl',
          data: this.dataSource.gas_hcl,
          fill: false,
          borderColor: 'aliceblue',
          borderWidth: 1,
          showLine: true,
          tension: 0
        },
        {
          label: 'Flue gas H2O',
          data: this.dataSource.gas_h2o,
          fill: false,
          borderColor: 'gray',
          borderWidth: 1,
          showLine: true,
          tension: 0
        }
          , {
          label: 'FT TEMP',
          data: this.dataSource.stack_temp,
          fill: false,
          borderColor: 'green',
          borderWidth: 1,
          showLine: true,
          tension: 0
        }
          , {
          label: 'FT PRESSURE',
          data: this.dataSource.stack_pressure,
          fill: false,
          borderColor: 'violet',
          borderWidth: 1,
          showLine: true,
          tension: 0
        }
          , {
          label: 'FT DUST',
          data: this.dataSource.stack_dust,
          fill: false,
          borderColor: 'yellow',
          borderWidth: 1,
          showLine: true,
          tension: 0
        }
          , {
          label: 'FT FLOW',
          data: this.dataSource.stack_flow,
          fill: false,
          borderColor: 'orange',
          borderWidth: 1,
          showLine: true,
          tension: 0
        }
          , {
          label: 'Furnance TT0301',
          data: this.dataSource.temp_furnance301,
          fill: false,
          borderColor: 'black',
          borderWidth: 1,
          showLine: true,
          tension: 0
        }
          , {
          label: 'Furnance TT0302',
          data: this.dataSource.temp_furnance302,
          fill: false,
          borderColor: 'tomato',
          borderWidth: 1,
          showLine: true,
          tension: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to adjust both width and height
        aspectRatio: 0.5 // You can adjust this value to control the aspect ratio of the chart
      }
    });
  }

  // line chart visibility
  ngAfterViewInit(): void {
    this.chartCanvas.nativeElement.addEventListener('click', (event: any) => {
      const activePoints = this.chart.getActiveElements(event);

      if (activePoints.length > 0) {
        const datasetIndex = activePoints[0].datasetIndex;
        const dataset = this.chart.data.datasets[datasetIndex];
        dataset.showLine = !dataset.showLine; // Toggle visibility
        this.chart.update(); // Update the chart
      }
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}









