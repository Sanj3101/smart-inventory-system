import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByProductTable } from './sales-by-product-table';

describe('SalesByProductTable', () => {
  let component: SalesByProductTable;
  let fixture: ComponentFixture<SalesByProductTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByProductTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByProductTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
