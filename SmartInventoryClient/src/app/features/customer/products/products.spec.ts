import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustProducts } from './products';

describe('Products', () => {
  let component: CustProducts;
  let fixture: ComponentFixture<CustProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
