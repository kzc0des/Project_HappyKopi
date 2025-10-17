import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizesPage } from './sizes-page';

describe('SizesPage', () => {
  let component: SizesPage;
  let fixture: ComponentFixture<SizesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
