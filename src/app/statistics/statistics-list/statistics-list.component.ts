import { Component, OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js/auto'
import { ServerService } from '../../server.service';
Chart.register(...registerables)

@Component({
selector: 'app-statistics-list',
templateUrl: './statistics-list.component.html',
styleUrls: ['./statistics-list.component.scss']
})
export class StatisticsListComponent implements OnInit {
  chart:any;
  
  constructor(private data: ServerService) {}

  ngOnInit(): void {
    this.data.dailyUpdate().subscribe(res=> {
      let temp_max = res.map((res:any) => res.main.temp_max)
      let temp_min = res.map((res:any) => res.main.temp_min)
      let date = res.map((res:any) => res.dt)

      let allDates: string[] = []
      date.forEach((res: any) => {
        let jsdate = new Date(res * 1000)
        allDates.push(jsdate.toLocaleDateString('en', {year: 'numeric', month: 'short', day: 'numeric'}))
      });

      //create chart
      this.chart = new Chart("linechart", {
        type: 'line',
        data: {
          labels: allDates,
          datasets: [{
            label: 'Minimum Temperature',
            data: temp_min,
            borderWidth: 1
          },
          {
            label: 'Maximum Temperature',
            data: temp_max,
            borderWidth: 1
          }]},
      });
    })
  }
}


  




    
