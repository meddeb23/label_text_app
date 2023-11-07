import { TestBed } from '@angular/core/testing';

import { LabelsManagementService } from './labels-management.service';

describe('LabelsManagementService', () => {
  let service: LabelsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
