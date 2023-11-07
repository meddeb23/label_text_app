import { TestBed } from '@angular/core/testing';

import { DocumentUpdateService } from './document-update.service';

describe('DocumentUpdateService', () => {
  let service: DocumentUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
