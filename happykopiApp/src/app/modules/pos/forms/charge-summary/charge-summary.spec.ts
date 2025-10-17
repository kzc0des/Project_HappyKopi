import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeSummary } from './charge-summary';

describe('ChargeSummary', () => {
  let component: ChargeSummary;
  let fixture: ComponentFixture<ChargeSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
