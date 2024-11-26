import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomButtonComponent } from './custom-button.component';
import { By } from '@angular/platform-browser';

describe('CustomButtonComponent', () => {
  let component: CustomButtonComponent;
  let fixture: ComponentFixture<CustomButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.buttonText).toEqual('');
    expect(component.formValid).toBeFalse();
  });

  it('should bind input values correctly', () => {
    component.buttonText = 'Submit';
    component.formValid = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    expect(button.textContent.trim()).toEqual('Submit');
    expect(button.disabled).toBeFalse();
  });

  it('should disable the button if formValid is false', () => {
    component.formValid = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    expect(button.disabled).toBeTrue();
  });

  it('should emit onButtonClick event when the button is clicked', () => {
    spyOn(component.onButtonClick, 'emit');

    component.formValid = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(component.onButtonClick.emit).toHaveBeenCalledWith(true);
  });

  it('should not emit onButtonClick event if the button is disabled', () => {
    spyOn(component.onButtonClick, 'emit');

    component.formValid = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(component.onButtonClick.emit).not.toHaveBeenCalled();
  });
});

