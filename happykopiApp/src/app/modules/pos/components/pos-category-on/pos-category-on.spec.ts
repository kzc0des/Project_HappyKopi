import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCategoryOn } from './pos-category-on';

describe('PosCategoryOn', () => {
  let component: PosCategoryOn;
  let fixture: ComponentFixture<PosCategoryOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosCategoryOn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosCategoryOn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
