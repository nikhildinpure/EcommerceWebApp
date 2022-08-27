import { TestBed } from '@angular/core/testing';

import { EcommerceFormServiceService } from './ecommerce-form-service.service';

describe('EcommerceFormServiceService', () => {
  let service: EcommerceFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcommerceFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
