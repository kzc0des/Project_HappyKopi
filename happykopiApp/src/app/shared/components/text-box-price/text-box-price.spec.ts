import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxPrice } from './text-box-price';

describe('TextBoxPrice', () => {
  let component: TextBoxPrice;
  let fixture: ComponentFixture<TextBoxPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextBoxPrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextBoxPrice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
