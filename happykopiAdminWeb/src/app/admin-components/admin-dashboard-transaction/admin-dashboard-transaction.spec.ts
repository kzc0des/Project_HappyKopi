import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardTransaction } from './admin-dashboard-transaction';

describe('AdminDashboardTransaction', () => {
  let component: AdminDashboardTransaction;
  let fixture: ComponentFixture<AdminDashboardTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
