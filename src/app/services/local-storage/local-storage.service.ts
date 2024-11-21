import { Injectable } from '@angular/core';
import { TranslatorForm } from '../../interfaces/translator-form';


/**
 * A service to manage storing, retrieving, and clearing TranslatorForm data in localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storageKey = 'translatorForm';

  /**
   * Saves the TranslatorForm data to localStorage.
   * @param formData - The TranslatorForm object to be saved.
   */
  saveTranslatorForm(formData: TranslatorForm): void {
    try {
      const formDataString = JSON.stringify(formData);
      localStorage.setItem(this.storageKey, formDataString);
    } catch (error) {
      console.error('Error saving data to localStorage', error);
    }
  }

  /**
   * Retrieves the TranslatorForm data from localStorage.
   * @returns The TranslatorForm object if data exists, or null if no data is found.
   */
  getTranslatorForm(): TranslatorForm | null {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) return JSON.parse(storedData);
      return null;
    } catch (error) {
      console.error('Error retrieving data from localStorage', error);
      return null;
    }
  }

  /**
   * Clears the TranslatorForm data from localStorage.
   */
  clearTranslatorForm(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing data from localStorage', error);
    }
  }
}