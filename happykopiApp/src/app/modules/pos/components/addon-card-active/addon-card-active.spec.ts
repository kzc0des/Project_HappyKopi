import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCardActive } from './addon-card-active';

describe('AddonCardActive', () => {
  let component: AddonCardActive;
  let fixture: ComponentFixture<AddonCardActive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardActive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonCardActive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
