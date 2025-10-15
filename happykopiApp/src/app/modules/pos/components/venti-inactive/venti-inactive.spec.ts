import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentiInactive } from './venti-inactive';

describe('VentiInactive', () => {
  let component: VentiInactive;
  let fixture: ComponentFixture<VentiInactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentiInactive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentiInactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
