import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryDateCard } from './expiry-date-card';

describe('ExpiryDateCard', () => {
  let component: ExpiryDateCard;
  let fixture: ComponentFixture<ExpiryDateCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiryDateCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiryDateCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
