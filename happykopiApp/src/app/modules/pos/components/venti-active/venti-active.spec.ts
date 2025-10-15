import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentiActive } from './venti-active';

describe('VentiActive', () => {
  let component: VentiActive;
  let fixture: ComponentFixture<VentiActive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentiActive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentiActive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
