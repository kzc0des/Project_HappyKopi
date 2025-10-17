import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YellowButton } from './yellow-button';

describe('YellowButton', () => {
  let component: YellowButton;
  let fixture: ComponentFixture<YellowButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YellowButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YellowButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
