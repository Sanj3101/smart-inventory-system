import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByDateTable } from './sales-by-date-table';

describe('SalesByDateTable', () => {
  let component: SalesByDateTable;
  let fixture: ComponentFixture<SalesByDateTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByDateTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByDateTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
