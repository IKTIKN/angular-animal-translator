import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomButtonComponent } from "../custom-button/custom-button.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslatorForm } from '../../interfaces/translator-form';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { OutputTextAreaComponent } from "../output-text-area/output-text-area.component";
import { AnimalTranslatorService } from '../../services/animal-translator/animal-translator.service';

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
  detectedLanguage = 'Taal herkennen';
  currentLanguage = 'Mens';
  currentDestinationSpecie = '';
  translateButtonText = 'Vertaal';
  translatorForm: FormGroup;
  translatorFormDestinationItems: string[];
  translatorFormSpecieItems: string[];
  translatedText: string = '';

  constructor(
    private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private translator: AnimalTranslatorService
  ) {
    // localStorage.clearTranslatorForm();
    this.translatorForm = this.fb.group({
      textToTranslate: ['', [Validators.required, Validators.minLength(1)]],
      fromLanguage: [this.detectedLanguage],
      toLanguage: [''],
      drunk: [false]
    });

    this.translatorFormDestinationItems = this.getDestinationItems('Mens');
    this.translatorFormSpecieItems = translator.getAllSpecies();
  }

  /**
   * Initializes the component. Loads form data from localStorage if available
   * and sets up a listener for form value changes to dynamically update the state.
   */
  ngOnInit(): void {
    // this.loadFormFromLocalStorage();
    this.translatorForm.valueChanges.subscribe((formValue: TranslatorForm) => {
      // console.log(this.currentLanguage, formValue.fromLanguage, formValue.fromLanguage.includes('herkennen'));
      this.translatorForm.get('textToTranslate')?.markAsUntouched;

      if (this.isUpdatingForm) return;
      this.localStorage.saveTranslatorForm(formValue);
      if (formValue.fromLanguage != this.currentLanguage && !formValue.fromLanguage.includes('herkennen')) {
        this.translatorFormDestinationItems = this.getDestinationItems(formValue.fromLanguage);
      }

      if (formValue.fromLanguage.includes('herkennen')) {
        this.translatorFormDestinationItems = this.getDestinationItems(this.currentLanguage);
      }
      this.setCurrentLanguage(formValue.fromLanguage, formValue.textToTranslate);
    });
  }

  /**
   * Fetches the translated text based on the input text and selected species language.
   *
   * @param {string} text - The text to translate.
   * @param {string} specie - The target species language.
   * @param {boolean} drunk - Indicates if the user is drunk.
   */
  getTranslation(text: string, specie: string, drunk: boolean): void {
    this.translatedText = this.translator.translate(text, specie, drunk);
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
    if (destinations.length > 0) this.updateFormValue('toLanguage', destinations[0]);
    return destinations;
  }

  /**
   * Sets the `currentLanguage` based on the `fromLanguage` and validates the input text.
   * If "Taal herkennen" is selected, it attempts to detect the language from the input.
   *
   * @param {string} fromLanguage - The source language selected by the user.
   * @param {string} textToTranslate - The input text to translate.
   */
  setCurrentLanguage(fromLanguage: string, textToTranslate: string): void {
    const detectedLanguage = this.translator.detectLanguage(textToTranslate);
    if (fromLanguage.includes('herkennen')) {
      if (detectedLanguage === 'Fout') {
        this.detectedLanguage = 'Taal herkennen';
        // this.currentLanguage = 'Mens';

        // Trigger a form error
        this.translatorForm.get('textToTranslate')?.setErrors({
          languageDetectionFailed: 'Taal kon niet automatisch worden herkend'
        });
      } else {
        // Successful language detection
        this.detectedLanguage = `{${detectedLanguage}} gedetecteerd`;
        this.currentLanguage = detectedLanguage;
        this.translatorFormDestinationItems = this.getDestinationItems(this.currentLanguage);
        this.translatorForm.get('textToTranslate')?.setErrors(null);
      }
    } else {
      if (detectedLanguage != fromLanguage) {
        console.log(detectedLanguage, this.currentLanguage);
        // Trigger a form error
        this.translatorForm.get('textToTranslate')?.setErrors({
          textSelectMatchFailed: 'Input komt niet overeen met geselecteerde taal'
        });
      } else {
        // Ensure errors are cleared if not in detection mode
        this.translatorForm.get('textToTranslate')?.setErrors(null);
      }
      this.currentLanguage = fromLanguage;
      this.translatedText = '';
      this.detectedLanguage = 'Taal herkennen';
    }
  }

  /**
   * Triggers the translation process. Logs form validity and retrieves
   * the translated text for the selected language.
   */
  onTranslate(): void {
    const form: TranslatorForm = this.translatorForm.value;
    this.currentDestinationSpecie = form.toLanguage;
    this.getTranslation(form.textToTranslate, form.toLanguage, form.drunk);
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

  /**
   * Loads stored form data from localStorage, if available, and patches it into the form.
   */
  private loadFormFromLocalStorage(): void {
    const storedFormData = this.localStorage.getTranslatorForm();
    if (storedFormData) {
      this.translatorForm.patchValue(storedFormData);
    }
  }
}
