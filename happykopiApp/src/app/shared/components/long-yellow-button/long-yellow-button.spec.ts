import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongYellowButton } from './long-yellow-button';

describe('LongYellowButton', () => {
  let component: LongYellowButton;
  let fixture: ComponentFixture<LongYellowButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LongYellowButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LongYellowButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
