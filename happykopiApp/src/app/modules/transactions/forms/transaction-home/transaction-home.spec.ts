import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionHome } from './transaction-home';

describe('TransactionHome', () => {
  let component: TransactionHome;
  let fixture: ComponentFixture<TransactionHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
