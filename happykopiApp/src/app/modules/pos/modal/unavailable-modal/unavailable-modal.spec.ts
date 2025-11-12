import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailableModal } from './unavailable-modal';

describe('UnavailableModal', () => {
  let component: UnavailableModal;
  let fixture: ComponentFixture<UnavailableModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnavailableModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnavailableModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
