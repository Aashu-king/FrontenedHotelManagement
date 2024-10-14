import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
@Component({
  selector: 'app-table-resrvation',
  templateUrl: './table-resrvation.component.html',
  styleUrl: './table-resrvation.component.css'
})
export class TableResrvationComponent {

  reservationForm: FormGroup;
  isEditMode: boolean = false;
  SaveUpdateEvent: boolean = false;
  dataArray : any
Guestoptions: any[] = [];  
Guests: any[] = [];
filteredGuest$: Observable<any[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<TableResrvationComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) {

    this.reservationForm = this.fb.group({
      guestId: [Validators.required],
      table_id: [Validators.required],
      reservation_start: ['', Validators.required],
      reservation_end: ['', Validators.required],
      status: ['Confirmed', Validators.required],
      GuestName: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.getTableData(this.data.reservationId);
    }
    
    this.loadOutlets();
    this.setupOutletAutoComplete();
  }

  private loadOutlets(): void {
    this.http.get('http://localhost:3000/api/v1/dropdown-guests').subscribe((result: any) => {
      this.Guests = result;  // Update the correct array
      console.log("Guests data loaded:", this.Guests);
    });
  }
  

  private setupOutletAutoComplete(): void {
    this.filteredGuest$ = this.reservationForm.get('GuestName')!.valueChanges.pipe( 
      startWith(''),
      map(value => this.filterOutlets(value || ''))
    );
  }

  private filterOutlets(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.Guests.filter(guest => 
      (`${guest.firstName} ${guest.lastName}`).toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any): void {
    const selectedGuest = this.Guests.find(guest => 
      `${guest.firstName} ${guest.lastName}` === event.option.value
    );
    if (selectedGuest) {
      this.reservationForm.get('guestId')?.setValue(selectedGuest.guestId);
    }
  }

  populateForm(reservation: any) {
    console.log("🚀 ~ TableResrvationComponent ~ populateForm ~ reservation:", reservation)
    this.reservationForm.patchValue({
      guestId: reservation.guestId,
      table_id: reservation.table_id,
      reservation_start: reservation.reservation_start,
      reservation_end: reservation.reservation_end,
      status: reservation.status,
    });
  }

  getTableData(tableId: number) {
    this.http.get(`http://localhost:3000/api/v1/table-reservations/${tableId}`).subscribe((result: any) => {
      this.reservationForm.patchValue(result); 
    }, error => {
      console.error('Error fetching table data:', error);
    });
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      if (this.isEditMode) {
        this.updateReservation(this.data.reservation.reservation_id);
      } else {
        this.createReservation();
      }
    }
  }

  createReservation() {
    this.http.post('http://localhost:3000/api/v1/table-reservation', this.reservationForm.value)
      .subscribe(response => {
        console.log('Reservation created:', response);
        this.dialogRef.close(true); // Close dialog and notify success
      });
  }

  updateReservation(reservationId: number) {
    this.http.put(`http://localhost:3000/api/v1/table-reservations/${reservationId}`, this.reservationForm.value)
      .subscribe(response => {
        console.log('Reservation updated:', response);
        this.dialogRef.close(true); // Close dialog and notify success
      }, error => {
        console.error('Error updating reservation:', error);
      });
  }

  closeDialog() {
    this.dialogRef.close(); // Close the dialog
  }
}
