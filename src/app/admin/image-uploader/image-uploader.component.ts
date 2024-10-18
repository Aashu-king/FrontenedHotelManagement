import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})
export class ImageUploaderComponent implements OnInit{
  hotelForm: FormGroup;
  outletForm!: FormGroup;
  roomForm!: FormGroup;

  constructor(private fb : FormBuilder,public dialogRef: MatDialogRef<ImageUploaderComponent>,private http: HttpClient,private router : Router,@Inject(MAT_DIALOG_DATA) public data: any,) {
    this.hotelForm = this.fb.group({
      hotelid: ['', Validators.required], 
      images: [null, Validators.required] 
    });
    this.outletForm = this.fb.group({
      outletid: ['', Validators.required], 
      images: [null, Validators.required] 
    });
    this.roomForm = this.fb.group({
      roomId: ['', Validators.required], // Hotel ID set to default value "1"
      images: [null, Validators.required] // Image file input
    });
   


  }

  ngOnInit(): void {
    if (this.data) {
      if(this.data.forWhichImage === 'hotel'){

        this.hotelForm.get('hotelid')?.patchValue(this.data.hotelid);
      }else if(this.data.forWhichImage === 'outlet'){
        console.log("🚀 ~ ImageUploaderComponent ~ ngOnInit ~ this.data.forWhichImage:", this.data.forWhichImage)
        this.outletForm.get('outletid')?.patchValue(this.data.outletid);
        console.log("🚀 ~ ImageUploaderComponent ~ ngOnInit ~ this.data.outletid:", this.data.outletid)



      }else{
        this.roomForm.get('roomId')?.patchValue(this.data.roomId);


      }
    } 
  }

  // Handle image file input change
  onImageChange(event: any) {
    const files = event.target.files;
    if (files.length > 0 ) {
      if(this.data.forWhichImage === 'hotel'){

        this.hotelForm.patchValue({ images: files });
      }else if(this.data.forWhichImage === 'outlet'){
        this.outletForm.patchValue({ images: files });

      }else{
        this.roomForm.patchValue({ images: files });

      }
    }
  }

  // Submit the form
  onSubmit() {
    if (this.hotelForm.valid) {
      const formData = new FormData();
      formData.append('hotelid', this.hotelForm.get('hotelid')?.value);

      const images: File[] = this.hotelForm.get('images')?.value;
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

     this.http.post('http://localhost:3000/api/v1/upload', formData).subscribe(response => console.log(response));
      console.log('Form Data ready to be submitted!', formData);
    }
    if(this.outletForm.valid){
      const formData = new FormData();
      formData.append('outletid', this.outletForm.get('outletid')?.value);

      const images: File[] = this.outletForm.get('images')?.value;
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      // Make the HTTP POST request to your API
      this.http.post('http://localhost:3000/api/v1/uploadOutlet', formData).subscribe(response => console.log(response));
      console.log('Form Data ready to be submitted!', formData);
    }
    if(this.roomForm.valid){
      const formData = new FormData();
      formData.append('roomId', this.roomForm.get('roomId')?.value);

      // Append each selected image to FormData
      const images: File[] = this.roomForm.get('images')?.value;
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      this.http.post('http://localhost:3000/api/v1/uploadRoom', formData).subscribe(response => console.log(response));
      console.log('Form Data ready to be submitted!', formData);
    }
  }
}
