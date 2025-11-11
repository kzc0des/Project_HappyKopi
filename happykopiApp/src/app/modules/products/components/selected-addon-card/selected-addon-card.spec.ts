import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedAddonCard } from './selected-addon-card';

describe('SelectedAddonCard', () => {
  let component: SelectedAddonCard;
  let fixture: ComponentFixture<SelectedAddonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedAddonCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedAddonCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
