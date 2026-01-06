import { TestBed } from '@angular/core/testing';

import { WarehouseOrderService } from './warehouse-order-service';

describe('OrderService', () => {
  let service: WarehouseOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
