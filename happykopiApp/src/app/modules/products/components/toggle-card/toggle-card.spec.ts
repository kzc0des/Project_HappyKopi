import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCard } from './toggle-card';

describe('ToggleCard', () => {
  let component: ToggleCard;
  let fixture: ComponentFixture<ToggleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
