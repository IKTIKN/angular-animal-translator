/**
 * Contract for formdata values from FormBuilder.
 */
export interface TranslatorForm {
    textToTranslate: string;
    fromLanguage: string;
    toLanguage: string;
    drunk: boolean;
}