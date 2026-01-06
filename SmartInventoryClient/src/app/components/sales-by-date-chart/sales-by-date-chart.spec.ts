import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByDateChart } from './sales-by-date-chart';

describe('SalesByDateChart', () => {
  let component: SalesByDateChart;
  let fixture: ComponentFixture<SalesByDateChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByDateChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByDateChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
