import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReports } from './warehouse-reports';

describe('WarehouseReports', () => {
  let component: WarehouseReports;
  let fixture: ComponentFixture<WarehouseReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
