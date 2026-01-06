import { TestBed } from '@angular/core/testing';

import { CustOrderService } from './cust-order-service';

describe('CustOrderService', () => {
  let service: CustOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
