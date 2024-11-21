import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const mockTranslatorForm = { textToTranslate: 'Woef', fromLanguage: 'Labrador', toLanguage: 'Papegaai', drunk: false };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save data to localStorage', () => {
    const spy = spyOn(localStorage, 'setItem');
    service.saveTranslatorForm(mockTranslatorForm);
    expect(spy).toHaveBeenCalledWith('translatorForm', JSON.stringify(mockTranslatorForm));
  });

  it('should retrieve data from localStorage', () => {
    localStorage.setItem('translatorForm', JSON.stringify(mockTranslatorForm));
    const formData = service.getTranslatorForm();
    expect(formData).toEqual(mockTranslatorForm);
  });

  it('should return null if no data is in localStorage', () => {
    const formData = service.getTranslatorForm();
    expect(formData).toBeNull();
  });

  it('should handle errors when retrieving data from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('invalid JSON');
    const formData = service.getTranslatorForm();
    expect(formData).toBeNull();
  });

  it('should clear data from localStorage', () => {
    localStorage.setItem('translatorForm', JSON.stringify(mockTranslatorForm));
    const spy = spyOn(localStorage, 'removeItem');
    service.clearTranslatorForm();
    expect(spy).toHaveBeenCalledWith('translatorForm');
  });

  it('should handle errors when clearing data from localStorage', () => {
    spyOn(localStorage, 'removeItem').and.throwError('Unable to remove item');
    expect(() => service.clearTranslatorForm()).not.toThrow();
  });
});
