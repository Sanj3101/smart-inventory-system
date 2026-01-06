import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByProductChart } from './sales-by-product-chart';

describe('SalesByProductChart', () => {
  let component: SalesByProductChart;
  let fixture: ComponentFixture<SalesByProductChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByProductChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByProductChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
