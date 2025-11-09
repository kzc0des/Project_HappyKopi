import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransHistory } from './trans-history';

describe('TransHistory', () => {
  let component: TransHistory;
  let fixture: ComponentFixture<TransHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
