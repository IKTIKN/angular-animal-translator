import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TRANSLATOR_FORM, LANGUAGE_OPTIONS } from '../strings/strings';

/**
 * Creates a validation function for form controls that checks various conditions 
 * related to detected and current languages.
 *
 * @param {string} detected - The language detected by the system.
 * @param {string} currentLanguage - The currently selected language.
 * @returns {ValidatorFn} - A function that validates the input value of a form control.
 *
 * ### Validation Conditions:
 * - **Required Check**: Ensures the value is not empty or null. 
 *   If the value is invalid, an error is added under the key `TRANSLATOR_FORM.REQUIRED_KEY`.
 * - **Detection Failure Check**: Ensures the detected language is not an error state when
 *   the current language is set to "Detect Language". 
 *   If invalid, an error is added under `TRANSLATOR_FORM.DETECTION_FAILED_KEY`.
 * - **Mismatch Check**: Ensures the detected language matches the current language when 
 *   the current language is not set to "Detect Language". 
 *   If mismatched, an error is added under `TRANSLATOR_FORM.MISMATCH_KEY`.
 */
export function inputValidator(detected: string, currentLanguage: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const errors: ValidationErrors = {};
        const value = control.value;
        switch (true) {
            case !value || value.length < 1:
                errors[TRANSLATOR_FORM.REQUIRED_KEY] = TRANSLATOR_FORM.REQUIRED_ERROR;
                break;

            case detected === LANGUAGE_OPTIONS.ERROR_DETECT_LANGUAGE && currentLanguage === LANGUAGE_OPTIONS.DETECT_LANGUAGE:
                errors[TRANSLATOR_FORM.DETECTION_FAILED_KEY] = TRANSLATOR_FORM.DETECTION_FAILED_ERROR;
                break;

            case detected !== currentLanguage && currentLanguage !== LANGUAGE_OPTIONS.DETECT_LANGUAGE:
                errors[TRANSLATOR_FORM.MISMATCH_KEY] = TRANSLATOR_FORM.MISMATCH_ERROR;
                break;
        }
        return Object.keys(errors).length ? errors : null;
    };
}
