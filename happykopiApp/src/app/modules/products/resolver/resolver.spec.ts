import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resolver } from './resolver';

describe('Resolver', () => {
  let component: Resolver;
  let fixture: ComponentFixture<Resolver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resolver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resolver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
