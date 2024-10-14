import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesResvationListComponent } from './tables-resvation-list.component';

describe('TablesResvationListComponent', () => {
  let component: TablesResvationListComponent;
  let fixture: ComponentFixture<TablesResvationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablesResvationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesResvationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
