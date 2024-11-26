import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomButtonComponent } from "../custom-button/custom-button.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslatorForm } from '../../interfaces/translator-form';
import { OutputTextAreaComponent } from "../output-text-area/output-text-area.component";
import { AnimalTranslatorService } from '../../services/animal-translator/animal-translator.service';
import { LANGUAGE_OPTIONS, TRANSLATOR_FORM } from '../../strings/strings';
import { inputValidator } from '../../validators/input-validator';


@Component({
  selector: 'app-animal-translator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    CustomButtonComponent,
    OutputTextAreaComponent
  ],
  templateUrl: './animal-translator.component.html',
  styleUrl: './animal-translator.component.css'
})
export class AnimalTranslatorComponent {
  private isUpdatingForm = false;
  detectLanguageOptionText: string = LANGUAGE_OPTIONS.DETECT_LANGUAGE;
  detectedLanguage: string = LANGUAGE_OPTIONS.DETECT_LANGUAGE;
  currentLanguage: string = LANGUAGE_OPTIONS.HUMAN_LANGUAGE;
  translatorForm: FormGroup;
  translatorFormHeader: string = TRANSLATOR_FORM.FORM_HEADER;
  translatorFormTextAreaLabel: string = TRANSLATOR_FORM.TEXT_AREA_LABEL;
  translatorFormFromLabel: string = TRANSLATOR_FORM.FROM_LABEL;
  translatorFormToLabel: string = TRANSLATOR_FORM.TO_LABEL;
  translatorFormDrunkLabel: string = TRANSLATOR_FORM.DRUNK_LABEL;
  translatorFormButtonText: string = TRANSLATOR_FORM.TRANSLATE_BUTTON;
  translatorFormDestinationItems: string[];
  translatorFormSpecieItems: string[];
  translatedText: string = '';
  currentDestinationSpecie: string = '';

  constructor(
    private fb: FormBuilder,
    private translator: AnimalTranslatorService
  ) {
    this.translatorForm = this.fb.group({
      textToTranslate: ['', [inputValidator(this.detectedLanguage, this.currentLanguage)]],
      fromLanguage: [this.detectedLanguage],
      toLanguage: [''],
      drunk: [false]
    });

    this.translatorFormDestinationItems = this.getDestinationItems(LANGUAGE_OPTIONS.HUMAN_LANGUAGE);
    this.translatorFormSpecieItems = translator.getAllSpecies();
  }

  /**
   * Initializes the component. Loads form data from localStorage if available
   * and sets up a listener for form value changes to dynamically update the state.
   */
  ngOnInit(): void {
    this.translatorForm.get(TRANSLATOR_FORM.FROM_LANGUAGE_KEY)?.valueChanges.subscribe((language: string) => {
      this.translatorFormDestinationItems = this.getDestinationItems(
        language === LANGUAGE_OPTIONS.DETECT_LANGUAGE ? this.detectedLanguage : language
      );
    });

    this.translatorForm.valueChanges.subscribe((formValue: TranslatorForm) => {
      if (this.isUpdatingForm) return;
      this.translatedText = '';

      const language = formValue.fromLanguage;
      const detectedLanguage = this.translator.detectLanguage(formValue.textToTranslate);

      if (
        language === LANGUAGE_OPTIONS.DETECT_LANGUAGE 
        && detectedLanguage != LANGUAGE_OPTIONS.ERROR_DETECT_LANGUAGE 
        && formValue.textToTranslate.length > 0
      ) {
        this.detectLanguageOptionText = `{${detectedLanguage}} ${LANGUAGE_OPTIONS.DETECTED_LANGUAGE}`;
        // this.detectLanguageOptionText = this.formatMessage(LANGUAGE_OPTIONS.DETECT_LANGUAGE, detectedLanguage);
        if (detectedLanguage !== this.detectedLanguage) 
          this.translatorFormDestinationItems = this.getDestinationItems(detectedLanguage);
      } else {
        this.detectLanguageOptionText = LANGUAGE_OPTIONS.DETECT_LANGUAGE;
      }
      this.currentLanguage = language;
      this.detectedLanguage = detectedLanguage;
      this.updateTextToTranslateValidator();
    
    });
  }

  /**
   * Updates the validator for the "textToTranslate" form control if necessary.
   * Ensures the input adheres to the required rules based on the detected and current language.
   *
   * - Retrieves the "textToTranslate" control from the form.
   * - Checks if the validator needs to be updated to include invalid character detection.
   * - Sets the appropriate validators and refreshes the control's validation state without emitting events to avoid recursive updates.
   */
  updateTextToTranslateValidator(): void {
    const textToTranslateControl = this.translatorForm.get(TRANSLATOR_FORM.TEXT_TO_TRANSLATE_KEY);
    if (textToTranslateControl) {
      // Check if the validator needs to be updated
      const currentValidators = textToTranslateControl.validator?.({} as AbstractControl);
      if (!currentValidators || !currentValidators[TRANSLATOR_FORM.INVALID_CHARACTERS_KEY]) {
        textToTranslateControl.setValidators([inputValidator(this.detectedLanguage, this.currentLanguage)]);
        textToTranslateControl.updateValueAndValidity({ emitEvent: false }); // Prevent emitting to avoid recursion!
      }
    }
  }

  /**
   * Retrieves the destination language options available for a specific species.
   * Updates the `toLanguage` field in the form with the first destination if available.
   *
   * @param {string} specie - The species language for which to fetch destinations.
   * @returns {string[]} An array of destination languages.
   */
  getDestinationItems(specie: string): string[] {
    const destinations = this.translator.getRelatedLanguages(specie);
    this.currentDestinationSpecie = destinations[0];
    if (destinations.length > 0) this.updateFormValue(TRANSLATOR_FORM.TO_LANGUAGE_KEY, destinations[0]);
    return destinations;
  }

  /**
   * Handles the translation process when the translate button is clicked.
   * Extracts the form values, sets the target language, and updates the translated text.
   */
  onTranslate(): void {
    const form: TranslatorForm = this.translatorForm.value;
    this.currentDestinationSpecie = form.toLanguage;
    this.translatedText = this.translator.translate(form.textToTranslate, form.toLanguage, form.drunk);
  }

  /**
   * Updates a specific form control value programmatically.
   * Temporarily disables the form's valueChanges subscription to avoid recursion.
   *
   * @param {string} formControlName - The name of the form control to update.
   * @param {string} value - The new value to set for the form control.
   */
  private updateFormValue(formControlName: string, value: string): void {
    this.isUpdatingForm = true;
    this.translatorForm.get(formControlName)?.setValue(value);
    this.isUpdatingForm = false;
  }

}
