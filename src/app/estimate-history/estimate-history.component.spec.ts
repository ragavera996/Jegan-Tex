import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateHistoryComponent } from './estimate-history.component';

describe('EstimateHistoryComponent', () => {
  let component: EstimateHistoryComponent;
  let fixture: ComponentFixture<EstimateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
