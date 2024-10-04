import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRateListComponent } from './room-rate-list.component';

describe('RoomRateListComponent', () => {
  let component: RoomRateListComponent;
  let fixture: ComponentFixture<RoomRateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomRateListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
