import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTxnsComponent } from './client-txns.component';

describe('ClientTxnsComponent', () => {
  let component: ClientTxnsComponent;
  let fixture: ComponentFixture<ClientTxnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTxnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTxnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
