import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionCard } from './description-card';

describe('DescriptionCard', () => {
  let component: DescriptionCard;
  let fixture: ComponentFixture<DescriptionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
