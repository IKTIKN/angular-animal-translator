import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AnimalTranslatorComponent } from './animal-translator.component';
import { AnimalTranslatorService } from '../../services/animal-translator/animal-translator.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AnimalTranslatorComponent', () => {
  let component: AnimalTranslatorComponent;
  let fixture: ComponentFixture<AnimalTranslatorComponent>;
  let mockTranslatorService: jasmine.SpyObj<AnimalTranslatorService>;

  // Mock data
  const mockAllSpecies = ['Mens', 'Papegaai'];
  const mockRelatedLanguages = ['Labrador', 'Poedel', 'Parkiet', 'Papegaai'];
  const mockTranslatedText = 'woef woef';
  const mockDetectedLanguage = 'Mens';

  beforeEach(async () => {
    // Mock the AnimalTranslatorService
    mockTranslatorService = jasmine.createSpyObj('AnimalTranslatorService', [
      'getAllSpecies',
      'getRelatedLanguages',
      'translate',
      'detectLanguage',
    ]);

    // Provide mock return values
    mockTranslatorService.getAllSpecies.and.returnValue(mockAllSpecies);
    mockTranslatorService.getRelatedLanguages.and.returnValue(mockRelatedLanguages);
    mockTranslatorService.translate.and.returnValue(mockTranslatedText);
    mockTranslatorService.detectLanguage.and.returnValue(mockDetectedLanguage);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, AnimalTranslatorComponent], // Import NoopAnimationsModule
      providers: [{ provide: AnimalTranslatorService, useValue: mockTranslatorService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalTranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to "fromLanguage" changes and update destination items', () => {
      const spy = spyOn(component, 'getDestinationItems').and.callThrough();
      component.translatorForm.get('fromLanguage')?.setValue('Papegaai');
      expect(spy).toHaveBeenCalledWith('Papegaai');
      expect(component.translatorFormDestinationItems).toEqual(mockRelatedLanguages);
    });

    it('should detect language and update detectedLanguage when text is entered', () => {
      const mockTextToTranslate = 'Unit test text';
      component.translatorForm.get('textToTranslate')?.setValue(mockTextToTranslate);
      expect(mockTranslatorService.detectLanguage).toHaveBeenCalledWith(mockTextToTranslate);
      expect(component.detectedLanguage).toBe('Mens');
    });
  });

  describe('updateTextToTranslateValidator', () => {
    it('should set a validator on "textToTranslate" and update validity', () => {
      const control = component.translatorForm.get('textToTranslate');
      expect(control?.validator).toBeTruthy();
      component.updateTextToTranslateValidator();
      expect(control?.validator).toBeTruthy(); // Ensure it updates the validator
    });
  });

  describe('getDestinationItems', () => {
    it('should fetch destination items and set "currentDestinationSpecie"', () => {
      const mockSpecie = 'Poedel';
      const destinations = component.getDestinationItems(mockSpecie);
      expect(mockTranslatorService.getRelatedLanguages).toHaveBeenCalledWith(mockSpecie);
      expect(destinations).toEqual(mockRelatedLanguages);
      expect(component.currentDestinationSpecie).toBe('Labrador');
    });
  });

  describe('onTranslate', () => {
    it('should call the translator service to translate text', () => {
      const mockTextToTranslate = 'unit test';
      const mockToLanguage = 'Labrador'
      component.translatorForm.setValue({
        textToTranslate: mockTextToTranslate,
        fromLanguage: 'Mens',
        toLanguage: mockToLanguage,
        drunk: false,
      });

      component.onTranslate();

      expect(mockTranslatorService.translate).toHaveBeenCalledWith(mockTextToTranslate, mockToLanguage, false);
      expect(component.translatedText).toBe(mockTranslatedText);
    });
  });

  describe('updateFormValue', () => {
    it('should update a form control value without triggering valueChanges', () => {
      const mockToLanguage = 'Papegaai';
      const spy = spyOn(component.translatorForm, 'get').and.callThrough();
      component['updateFormValue']('toLanguage', mockToLanguage);
      expect(spy).toHaveBeenCalledWith('toLanguage');
      expect(component.translatorForm.get('toLanguage')?.value).toBe(mockToLanguage);
    });
  });
  
});
