import { TestBed } from '@angular/core/testing';

import { SegmentManagementService } from './segment-management.service';

describe('SegmentManagementService', () => {
  let service: SegmentManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SegmentManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
