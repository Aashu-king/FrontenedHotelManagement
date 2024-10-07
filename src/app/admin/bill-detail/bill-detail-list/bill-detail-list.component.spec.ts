import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDetailListComponent } from './bill-detail-list.component';

describe('BillDetailListComponent', () => {
  let component: BillDetailListComponent;
  let fixture: ComponentFixture<BillDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillDetailListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
