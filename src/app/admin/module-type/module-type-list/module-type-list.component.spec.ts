import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTypeListComponent } from './module-type-list.component';

describe('ModuleTypeListComponent', () => {
  let component: ModuleTypeListComponent;
  let fixture: ComponentFixture<ModuleTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleTypeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModuleTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
