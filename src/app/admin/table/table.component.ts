import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  tableForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TableComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tableForm = this.fb.group({
      table_id : [],
      table_number: ['', Validators.required],
      max_capacity: ['', [Validators.required, Validators.min(1)]],
      status: ['', Validators.required],
      outletid: [2] 
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.getTableData(this.data.tableId);
    }
  }

  getTableData(tableId: number) {
    this.http.get(`http://localhost:3000/api/v1/tables/${tableId}`).subscribe((result: any) => {
      this.tableForm.patchValue(result); // Populate the form with fetched data
    }, error => {
      console.error('Error fetching table data:', error);
    });
  }

  saveTable() {
    if(!this.data){
      if (this.tableForm.valid) {
        console.log(this.tableForm.value);
        this.http.post('http://localhost:3000/api/v1/tables', this.tableForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }else{
      if (this.tableForm.valid) {
        console.log(this.tableForm.value);
        this.http.put(`http://localhost:3000/api/v1/tables/${this.data}`, this.tableForm.value).subscribe(
          (response : any) => {
            console.log('Success!', response);
          }
        );
      }
    }
  }

  // saveTable(): void {
  //   if (this.tableForm.valid) {
  //     const tableData = this.tableForm.value;
  //     console.log("🚀 ~ TableComponent ~ saveTable ~ tableData:", tableData)
  //     if (this.data) {
  //       this.http.put(`http://localhost:3000/api/v1/tables/${this.data.tableId}`, tableData).subscribe(() => {
  //         this.dialogRef.close(tableData); // Optionally pass back data
  //       }, error => {
  //         console.error('Error updating table data:', error);
  //       });
  //     } else {
  //     console.log("🚀 ~ TableComponent ~ saveTable ~ this.tableForm.value:", this.tableForm.value)

  //       this.http.post('http://localhost:3000/api/v1/tables', tableData).subscribe(() => {
  //         this.dialogRef.close(tableData); // Optionally pass back data
  //       }, error => {
  //         console.error('Error creating table data:', error);
  //       });
  //     }
  //   }
  // }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
