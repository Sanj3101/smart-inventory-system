import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopProductKpi } from './top-product-kpi';

describe('TopProductKpi', () => {
  let component: TopProductKpi;
  let fixture: ComponentFixture<TopProductKpi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopProductKpi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopProductKpi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
