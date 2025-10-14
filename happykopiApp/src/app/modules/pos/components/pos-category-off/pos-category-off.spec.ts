import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCategoryOff } from './pos-category-off';

describe('PosCategoryOff', () => {
  let component: PosCategoryOff;
  let fixture: ComponentFixture<PosCategoryOff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosCategoryOff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosCategoryOff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
