import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orderForm!: FormGroup;
  isEdit: boolean = false;
  guests: any[] = [];
  outlets: any[] = [];
  menuItems : any;
  dropdownList = [];
  selectedItems : any[] = [];
  dropdownSettings = {};
  justOrderItemArray : any[] = []



  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.initializeForm();
    // this.getGuests();
    // this.getOutlets();
    this.getData()
    if (this.isEdit) {
      this.getOrderDetails(this.data.orderId);
      console.log("🚀 ~ OrdersComponent ~ ngOnInit ~ this.data:", this.data)
    }
      console.log("🚀 ~ OrdersComponent ~ ngOnInit ~ this.data.orderId:", this.data.orderId)

    

    // this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: 'id',
    //   textField: 'itemName',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };

   
    // this.orderForm.get('selectedMenuItems')?.valueChanges.subscribe((ele) => {
    //   console.log("🚀 ~ OrdersComponent ~ this.orderForm.get ~ ele:", ele)
    //   if(this.menuItems.length){
    //     this.calculateTotalPrice(ele)
    //   }
    // })

    this.addOrderItem();
  }

  initializeForm() {
    this.orderForm = this.fb.group({
      guestId: ['', Validators.required],
      outletid: ['', Validators.required],
      is_room_service: [false],
      order_status: ['Pending', Validators.required],
      order_date: [new Date(), Validators.required],
      orderItems: this.fb.array([]),
      total_amount: [0, Validators.min(0)]
    });
  }

  get orderItems() {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addOrderItem() {
    const orderItem = this.fb.group({
      menu_item_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, Validators.min(0)]
    });
    this.orderItems.push(orderItem);
  }

  removeOrderItem(index: number) {
    this.orderItems.removeAt(index);
    this.updateTotalAmount();
  }

  updatePrice(index: number) {
    const orderItem = this.orderItems.at(index);
    const menuItemId = orderItem.get('menu_item_id')?.value;
    const quantity = orderItem.get('quantity')?.value;
    const menuItem = this.menuItems.find((item : any) => item.menu_item_id === +menuItemId);
    
    if (menuItem) {
      const price = menuItem.price * quantity;
      orderItem.patchValue({ price });
      this.updateTotalAmount();
    }
  }

  updateTotalAmount() {
    const total = this.orderItems.controls.reduce((sum, item) => {
      return sum + (parseFloat(item.get('price')?.value) || 0);
    }, 0);
    this.orderForm.patchValue({ total_amount: total.toFixed(2) });
  }

  // calculateTotalPrice(data : any){
  // console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ data:", data)
  //   // const orderTotalPrice = this.menuItems.map((ele : any) => ele.menu_item_id == data.map((ele : any) => ele.id))
  //   let justArray : any[] = []
  //   if(data.length > 0 ){
  //     for (let index = 0; index < data.length; index++) {
  //       const element = data[index];
  //       console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ element:", element)
  //       const filteredObj = this.menuItems.filter((ele : any) => ele.menu_item_id == element.id)
  //       console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ filteredObj:", filteredObj)
  //       justArray.push(filteredObj[0])
  
  //       let TotalPrice = 0
  //       justArray.forEach((ele : any) => {
  //         TotalPrice += parseInt(ele.price)
  //       })
  //       if(justArray.length > 0){
  //         this.orderForm.get('total_amount')?.setValue(TotalPrice.toFixed(2))
  //         this.justOrderItemArray = justArray
  //         console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ this.justOrderItemArray :", this.justOrderItemArray )
  //       }else{
  //       this.orderForm.get('total_amount')?.setValue(0)
  //       }
  
  //     }
  //   }else{
  //     this.orderForm.get('total_amount')?.setValue(0)
  //   }
   
  //     console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ justArray:", justArray)
  //   console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ this.menuItems:", this.menuItems)
  //   // console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ orderTotalPrice:", orderTotalPrice)
  // }

  // getGuests() {
  //   this.http.get('http://localhost:3000/api/v1/guests').subscribe((response: any) => {
  //     this.guests = response;
  //   });
  // }

  // getOutlets() {
  //   this.http.get('http://localhost:3000/api/v1/outlets').subscribe((response: any) => {
  //     this.outlets = response;
  //   });
  // }

  getOrderDetails(orderId: number) {
    this.http.get(`http://localhost:3000/api/v1/orders/${orderId}`).subscribe((response: any) => {
      this.populateForm(response);
      console.log("🚀 ~ OrdersComponent ~ this.http.get ~ response:", response);
    });
  }

  populateForm(orderData: any) {
    // Populate main form fields
    this.orderForm.patchValue({
      guestId: orderData.guestId,
      outletid: orderData.outletid,
      is_room_service: orderData.is_room_service,
      order_status: orderData.order_status,
      order_date: new Date(orderData.order_date),
      total_amount: orderData.total_amount
    });

    // Clear existing order items
    while (this.orderItems.length !== 0) {
      this.orderItems.removeAt(0);
    }

    // Add and populate order items
    orderData.orderItems.forEach((item: any) => {
      const orderItem = this.fb.group({
        order_item_id: [item.order_item_id],
        menu_item_id: [item.menu_item_id, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        price: [item.price, Validators.min(0)]
      });
      this.orderItems.push(orderItem);
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;
      if (this.isEdit) {
        this.http
          .put(`http://localhost:3000/api/v1/orders/${this.data.orderId}`, orderData)
          .subscribe((response : any) => {
            this.dialogRef.close(true);
          });
      } else {
        const orderData = this.orderForm.value;
      orderData.selectedMenuItems = this.selectedItems.map(item => item.id);
      console.log("🚀 ~ OrdersComponent ~ onSubmit ~  orderData.selectedMenuItems:",  orderData.selectedMenuItems)
      console.log("🚀 ~ OrdersComponent ~ calculateTotalPrice ~ this.justOrderItemArray :", this.justOrderItemArray )
        let Obj = {
          orderData : this.orderForm.value,
          orderItemArray : this.justOrderItemArray
        }
        this.http.post('http://localhost:3000/api/v1/orders', Obj).subscribe((response : any) => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  getData() {
    this.http.get('http://localhost:3000/api/v1/menu').subscribe((result: any) => {
      this.menuItems = result;
      if (this.menuItems.length > 0) {
        
        console.log("🚀 ~ OrdersComponent ~ this.http.get ~ result:", result)
      }
    });
    this.http.get('http://localhost:3000/api/v1/dropdown-guests').subscribe((result: any) => {
      this.guests = result;
      if (this.guests.length > 0) {
        
        console.log("🚀 ~ OrdersComponent ~ this.http.get ~ result:", result)
      }
    });
    this.http.get('http://localhost:3000/api/v1/dropdown-outlets').subscribe((result: any) => {
      this.outlets = result;
      if (this.outlets.length > 0) {
        
        console.log("🚀 ~ OrdersComponent ~ this.http.get ~ result:", result)
      }
    });
  }

  onMenuItemChange(menu_item_id: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked; 
    const selectedItems: FormArray = this.orderForm.get('selectedMenuItems') as FormArray;
  
    if (isChecked) {
      selectedItems.push(this.fb.control(menu_item_id));
    } else {
      const index = selectedItems.controls.findIndex(x => x.value === menu_item_id);
      if (index !== -1) {
        selectedItems.removeAt(index);
      }
    }
  }



  onItemSelect(item: any) {
    this.selectedItems.push(item);
    this.updateSelectedMenuItems();
  }

  onSelectAll(items: any[]) {
    this.selectedItems = items;
    this.updateSelectedMenuItems();
  }

  onItemDeselect(item: any) {
    this.selectedItems = this.selectedItems.filter(x => x.id !== item.id);
    this.updateSelectedMenuItems();
  }

  onDeselectAll() {
    this.selectedItems = [];
    this.updateSelectedMenuItems();
    this.orderForm.get('total_amount')?.setValue(0)

  }

  updateSelectedMenuItems() {
    this.orderForm.patchValue({ selectedMenuItems: this.selectedItems });
  }
}
