import { TestBed } from '@angular/core/testing';

import { AnimalTranslatorService } from './animal-translator.service';

describe('AnimalTranslatorService', () => {
  let service: AnimalTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
