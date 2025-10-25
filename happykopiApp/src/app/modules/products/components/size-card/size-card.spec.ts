import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeCard } from './size-card';

describe('SizeCard', () => {
  let component: SizeCard;
  let fixture: ComponentFixture<SizeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
