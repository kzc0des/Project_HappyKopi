import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandeInactive } from './grande-inactive';

describe('GrandeInactive', () => {
  let component: GrandeInactive;
  let fixture: ComponentFixture<GrandeInactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandeInactive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrandeInactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
