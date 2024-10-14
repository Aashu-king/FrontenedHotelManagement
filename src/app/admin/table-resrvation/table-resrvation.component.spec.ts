import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableResrvationComponent } from './table-resrvation.component';

describe('TableResrvationComponent', () => {
  let component: TableResrvationComponent;
  let fixture: ComponentFixture<TableResrvationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableResrvationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableResrvationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
