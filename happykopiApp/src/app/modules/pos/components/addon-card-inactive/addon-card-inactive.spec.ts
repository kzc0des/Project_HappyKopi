import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCardInactive } from './addon-card-inactive';

describe('AddonCardInactive', () => {
  let component: AddonCardInactive;
  let fixture: ComponentFixture<AddonCardInactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCardInactive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonCardInactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
