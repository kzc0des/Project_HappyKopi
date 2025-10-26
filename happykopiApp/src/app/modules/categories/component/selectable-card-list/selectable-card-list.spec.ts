import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableCardList } from './selectable-card-list';

describe('SelectableCardList', () => {
  let component: SelectableCardList;
  let fixture: ComponentFixture<SelectableCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableCardList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectableCardList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
