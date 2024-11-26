import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutputTextAreaComponent } from './output-text-area.component';

describe('OutputTextAreaComponent', () => {
  let component: OutputTextAreaComponent;
  let fixture: ComponentFixture<OutputTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputTextAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutputTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'splitTextIntoLines');
      spyOn(window, 'addEventListener');
    });

    it('should call splitTextIntoLines with initial text', () => {
      component.text = 'Hello world!';
      component.ngOnInit();
      expect(component.splitTextIntoLines).toHaveBeenCalledWith('Hello world!');
    });

    it('should add a resize listener', () => {
      component.ngOnInit();
      expect(window.addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(window, 'removeEventListener');
    });

    it('should remove the resize listener', () => {
      component.ngOnInit(); // Add the listener first
      component.ngOnDestroy();
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', component.resizeListener);
    });
  });

  describe('ngOnChanges', () => {
    it('should call splitTextIntoLines with the updated text', () => {
      spyOn(component, 'splitTextIntoLines');
      component.text = 'New input text';
      component.ngOnChanges();
      expect(component.splitTextIntoLines).toHaveBeenCalledWith('New input text');
    });
  });

  describe('splitTextIntoLines', () => {
    it('should split text into lines of 10 words for wide screens and "Parkiet" specie', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(640);
      component.specie = 'Parkiet';
      const inputText = Array(25).fill('word').join(' ');
      component.splitTextIntoLines(inputText);
      expect(component.formattedText.length).toBe(3);
      expect(component.formattedText[0].length).toBe(10);
      expect(component.formattedText[2].length).toBe(5);
    });

    it('should not split text for screens less than 640px wide', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(500);
      const inputText = Array(20).fill('word').join(' ');
      component.splitTextIntoLines(inputText);
      expect(component.formattedText.length).toBe(1);
      expect(component.formattedText[0].length).toBe(20);
    });

    it('should handle empty input text', () => {
      component.splitTextIntoLines('');
      expect(component.formattedText).toEqual([['']]);
    });
  });

  describe('getColorClass', () => {
    it('should return a color class based on the index', () => {
      expect(component.getColorClass(0)).toBe('text-red-500');
      expect(component.getColorClass(1)).toBe('text-green-500');
      expect(component.getColorClass(2)).toBe('text-yellow-500');
      expect(component.getColorClass(3)).toBe('text-blue-500');
    });
  });

  describe('isSentenceEnd', () => {
    it('should return true for words ending with punctuation', () => {
      expect(component.isSentenceEnd('Hier.')).toBeTrue();
      expect(component.isSentenceEnd('Kijkt!')).toBeTrue();
      expect(component.isSentenceEnd('Toch?')).toBeTrue();
    });

    it('should return false for words without punctuation', () => {
      expect(component.isSentenceEnd('Niemand')).toBeFalse();
      expect(component.isSentenceEnd('Naar')).toBeFalse();
    });
  });
});
