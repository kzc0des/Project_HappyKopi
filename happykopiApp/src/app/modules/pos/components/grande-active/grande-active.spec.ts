import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandeActive } from './grande-active';

describe('GrandeActive', () => {
  let component: GrandeActive;
  let fixture: ComponentFixture<GrandeActive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandeActive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrandeActive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
