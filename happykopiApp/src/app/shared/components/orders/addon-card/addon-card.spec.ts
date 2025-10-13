import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCard } from './addon-card';

describe('AddonCard', () => {
  let component: AddonCard;
  let fixture: ComponentFixture<AddonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
