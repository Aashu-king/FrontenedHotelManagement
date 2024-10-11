import { Component } from '@angular/core';
import moment from 'moment';
import { RoomInfoComponent } from '../room-info/room-info.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReservationComponent } from '../reservation/reservation.component';
import { HttpClient } from '@angular/common/http';

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
     
    }
  }

