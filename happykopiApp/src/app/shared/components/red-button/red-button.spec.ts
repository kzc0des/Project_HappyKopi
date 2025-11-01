import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedButton } from './red-button';

describe('RedButton', () => {
  let component: RedButton;
  let fixture: ComponentFixture<RedButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
