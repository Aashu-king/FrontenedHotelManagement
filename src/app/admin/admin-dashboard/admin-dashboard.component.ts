import { Component, ViewChild } from '@angular/core';
import moment from 'moment';
import { RoomInfoComponent } from '../room-info/room-info.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReservationComponent } from '../reservation/reservation.component';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  currentYear!: number;
  currentMonth!: number;
  monthName!: string;
  calendarDays: any[][] = [];

  constructor(public dialog: MatDialog,private router : Router,private http : HttpClient ) { }

  ngOnInit(): void {
    const today = moment();
    this.currentYear = today.year();
    this.currentMonth = today.month();
    this.generateCalendar(this.currentYear, this.currentMonth);
    this.getData()
  }

  generateCalendar(year: number, month: number): void {
    const startOfMonth = moment([year, month]).startOf('month');
    const endOfMonth = moment([year, month]).endOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const endOfWeek = endOfMonth.clone().endOf('week');

    let date = startOfWeek.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(endOfWeek, 'day')) {
      calendar.push(
        Array(7).fill(0).map(() => date.add(1, 'day').clone())
      );
    }

    this.calendarDays = calendar.map(week => week.map(day => ({
      date: day.date(),
      fullDate: day
    })));

    this.monthName = moment([year, month]).format('MMMM');
  }

  changeMonth(value: number): void {
    this.currentMonth += value;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  isToday(day: any): boolean {
    return day.fullDate.isSame(moment(), 'day');
  }

  openRoomAvailability(data ?: any,value ?: any): void {
    console.log("🚀 ~ AdminDashboardComponent ~ openRoomAvailability ~ value:", value)
    if(data != '' && value !== 'toOpenGuestManagement'){
      var formattedDate = data.fullDate.format('YYYY-MM-DD');
    }
    if(value === 'toOpenCalendar' || value === 'toOpenGuestManagement'){
      this.dialog.open(RoomInfoComponent, {
       height: '80%',
       width: '80%',
       data : {formattedDate : formattedDate,value : value} ,
       panelClass: 'custom-dialog-container',
       position: { left: '280px', top: '60px' }
      });
    }
    if(value === 'toOpenReservation'){
      this.router.navigate(['admin/reservation'])
    }
    if(value === 'toCreateResrvation'){
      this.router.navigate(['admin/reservation'])
      this.dialog.open(ReservationComponent, {
        height: '80%',
        width: '80%',
        panelClass: 'custom-dialog-container',
        position: { left: '280px', top: '60px' }
       });
     }
    }

    schduleingFunction(){
      this.http.get('http://localhost:3000/api/v1/theSchdueling').subscribe((result : any) => {
     
        console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", result)
      })
    }
    getData(){
      this.http.get('http://localhost:3000/api/v1/graphData').subscribe((result : any) => {
     
        console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", result)
        this.createChart(result.barChartData)
      })
      this.http.get('http://localhost:3000/api/v1/outletGraphData').subscribe((result : any) => {
     
        console.log("🚀 ~ HotelListComponent ~ this.http.get ~ this.justHotelData:", result)
        const chartData = this.formatChartData(result);
        console.log("🚀 ~ AdminDashboardComponent ~ this.http.get ~ chartData:", chartData)
        this.createOutletChart(chartData)
      })
    }

    createOutletChart(chartData: ChartConfiguration['data']) {
      const canvas = document.getElementById('outletChart') as HTMLCanvasElement | null;
      if (!canvas) {
        console.error("Cannot find canvas element with id 'outletChart'");
        return;
      }
    
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Cannot get 2D context from canvas");
        return;
      }
    
      if (!chartData.labels || chartData.labels.length === 0 || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets[0].data.length === 0) {
        console.error("Chart data is empty or malformed:", chartData);
        return;
      }
    
      try {
        new Chart(ctx, {
          type: 'pie',
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Outlet-wise Collection'
              }
            }
          }
        });
        console.log("Chart created successfully");
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
    
    formatChartData(data: any): any {
      // Check if data has the expected structure
      console.log("🚀 ~ AdminDashboardComponent ~ formatChartData ~ data:", data)
      console.log("🚀 ~ AdminDashboardComponent ~ formatChartData ~ data.datasets:", data.data)
      console.log("🚀 ~ AdminDashboardComponent ~ formatChartData ~ data.labels:", data.labels)
      if (!data || !data.labels || !data.data) {
        console.error("Data format is incorrect:", data);
        return {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: []
          }]
        };
      }
    
      return {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ]
        }]
      };
    }

    createChart(chartData: any) {
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }
    // @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;


  // Bar Chart
  // public barChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   scales: {
  //     x: {},
  //     y: {
  //       min: 10
  //     }
  //   },
  //   plugins: {
  //     legend: {
  //       display: true,
  //     }
  //   }
  // };
  // public barChartType: ChartType = 'bar';
  // public barChartData: ChartData<'bar'> = {
  //   labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'], 
  //   datasets: [
  //     { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //     { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  //   ]
  // };

  // Pie Chart
  // public pieChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Pie Chart'
  //     }
  //   }
  // };
  // public pieChartType: ChartType = 'pie';
  // public pieChartData: ChartData<'pie', number[], string | string[]> = {
  //   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
  //   datasets: [{
  //     data: [300, 500, 100, 400, 200],
  //     backgroundColor: [
  //       'rgba(255, 99, 132, 0.8)',
  //       'rgba(54, 162, 235, 0.8)',
  //       'rgba(255, 205, 86, 0.8)',
  //       'rgba(75, 192, 192, 0.8)',
  //       'rgba(153, 102, 255, 0.8)'
  //     ],
  //     hoverOffset: 4
  //   }]
  // };

  }

