import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TobedelCard } from './tobedel-card';

describe('TobedelCard', () => {
  let component: TobedelCard;
  let fixture: ComponentFixture<TobedelCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TobedelCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TobedelCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
