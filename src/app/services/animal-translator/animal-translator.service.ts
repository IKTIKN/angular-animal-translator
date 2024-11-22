import { Injectable } from '@angular/core';

export interface LanguageMap {
  specie: string;
  speaksTo: string[];
  vocabulary: string[] | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalTranslatorService {

  private languageMapping: LanguageMap[] = [
    {
      specie: 'Mens',
      speaksTo: ['Labrador', 'Poedel', 'Parkiet', 'Papegaai'],
      vocabulary: undefined
    },
    {
      specie: 'Labrador',
      speaksTo: ['Poedel', 'Papegaai'],
      vocabulary: ['woef']
    },
    {
      specie: 'Poedel',
      speaksTo: ['Labrador', 'Papegaai'],
      vocabulary: ['woefie']
    },
    {
      specie: 'Parkiet',
      speaksTo: ['Papegaai'],
      vocabulary: ['tjilp', 'piep']
    }
  ];

  /**
   * Detects the species based on the vocabulary used in the input text.
   *
   * - A single species is identified if all words in the input belong to its vocabulary.
   * - If words from multiple species' vocabularies are used, it returns 'Fout'.
   * - If any word doesn't match any species' vocabulary, it classifies as 'Mens'.
   *
   * **Sanitization Process:**
   * - Converts input text to lowercase for case-insensitive matching.
   * - Removes non-alphabetic characters except spaces.
   * - Collapses multiple spaces into a single space and trims leading/trailing spaces.
   *
   * @param {string} sampleText - The input text to analyze.
   * @returns {string} The detected species ('Labrador', 'Poedel', 'Parkiet', 'Mens'),
   *                   'Fout' if words from multiple species are detected,
   *                   or 'Mens' if invalid words are present.
   */
  detectLanguage(sampleText: string): string {
    // Normalize and sanitize the input
    const sanitizedInput = sampleText
      .toLowerCase()
      .replace(/[^a-z\s]/g, '') // Remove non-alphabetic characters
      .replace(/\s+/g, ' ')     // Replace multiple spaces with a single space
      .trim();

    const normalizedWords = sanitizedInput.split(' ');

    let matchedSpecies: Set<string> = new Set();
    let isHuman = false;

    // Check each word in species' vocabularies
    for (const word of normalizedWords) {
      let wordMatched = false;

      for (const mapping of this.languageMapping) {
        if (mapping.vocabulary !== undefined && mapping.vocabulary.includes(word)) {
          matchedSpecies.add(mapping.specie);
          wordMatched = true;
        }
      }

      if (!wordMatched) isHuman = true;
    }

    // Words belong to multiple species
    if (matchedSpecies.size > 1) return 'Fout';

    // No matches or invalid words detected
    if (matchedSpecies.size === 0 || isHuman) return 'Mens';

    // return exact match
    return Array.from(matchedSpecies)[0];
  }

  getRelatedLanguages(specie: string): string[] {
    const mapping = this.languageMapping.find(map => map.specie === specie);
    return mapping ? mapping.speaksTo : [];
  }

  getAllSpecies(): string[] {
    return this.languageMapping.map(map => map.specie);
  }

  /**
   * Translates the input text to the specified species' language.
   *
   * Translation Rules:
   * - Labrador: Replace every word with "woef"
   * - Poedel: Replace every word with "woefie"
   * - Parkiet: Replace words starting with a vowel with "tjilp" and others with "piep"
   * - Papegaai: Place "Ik praat je na: " before the original text.
   *
   * @param {string} text - The input text to be translated.
   * @param {boolean} drunk - Indicates if the user is drunk.
   * @param {string} toSpecie - The target species ('Labrador', 'Poedel', 'Parkiet', 'Papegaai').
   * @returns {string} The translated text.
   */
  translate(text: string, toSpecie: string, drunk: boolean): string {
    // Split the input text into words
    const words = text.trim().split(/\s+/);
  
    let translatedText: string;
  
    switch (toSpecie) {
      case 'Labrador':
        // Replace every word with 'woef'
        translatedText = words.map(() => 'woef').join(' ');
        break;
  
      case 'Poedel':
        // Replace every word with 'woefie'
        translatedText = words.map(() => 'woefie').join(' ');
        break;
  
      case 'Parkiet':
        // Replace words starting with a vowel with 'tjilp', others with 'piep'
        translatedText = words
          .map(word => /^[aeiou]/i.test(word) ? 'tjilp' : 'piep')
          .join(' ');
        break;
  
      case 'Papegaai':
        // Prepend "Ik praat je na: " to the original text
        translatedText = `Ik praat je na: ${text}`;
        break;
  
      default:
        // Return the original text if species is not recognized
        translatedText = text;
    }
  
    if (drunk) {
      translatedText += ' Burp!';
    }
  
    return translatedText;
  }
  

}
