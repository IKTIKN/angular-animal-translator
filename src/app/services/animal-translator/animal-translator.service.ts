import { Injectable } from '@angular/core';
import { LANGUAGE_OPTIONS } from '../../strings/strings';
import { LanguageMap } from '../../interfaces/language-map';


@Injectable({
  providedIn: 'root'
})
export class AnimalTranslatorService {

  private languageMapping: LanguageMap[] = [
    {
      specie: LANGUAGE_OPTIONS.HUMAN_LANGUAGE,
      speaksTo: [
        LANGUAGE_OPTIONS.LABRADOR_LANGUAGE,
        LANGUAGE_OPTIONS.POODLE_LANGUAGE,
        LANGUAGE_OPTIONS.PARAKEET_LANGUAGE,
        LANGUAGE_OPTIONS.PARROT_LANGUAGE,
      ],
      vocabulary: undefined
    },
    {
      specie: LANGUAGE_OPTIONS.LABRADOR_LANGUAGE,
      speaksTo: [
        LANGUAGE_OPTIONS.POODLE_LANGUAGE,
        LANGUAGE_OPTIONS.PARROT_LANGUAGE,
      ],
      vocabulary: [LANGUAGE_OPTIONS.LABRADOR_VOCABULARY]
    },
    {
      specie: LANGUAGE_OPTIONS.POODLE_LANGUAGE,
      speaksTo: [
        LANGUAGE_OPTIONS.LABRADOR_LANGUAGE,
        LANGUAGE_OPTIONS.PARROT_LANGUAGE
      ],
      vocabulary: [LANGUAGE_OPTIONS.POODLE_VOCABULARY]
    },
    {
      specie: LANGUAGE_OPTIONS.PARAKEET_LANGUAGE,
      speaksTo: [LANGUAGE_OPTIONS.PARROT_LANGUAGE],
      vocabulary: [
        LANGUAGE_OPTIONS.PARAKEET_VOCABULARY_TJILP,
        LANGUAGE_OPTIONS.PARAKEET_VOCABULARY_PEEP
      ]
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
    if (matchedSpecies.size > 1) return LANGUAGE_OPTIONS.ERROR_DETECT_LANGUAGE;

    // No matches or invalid words detected
    if (matchedSpecies.size === 0 || isHuman) return LANGUAGE_OPTIONS.HUMAN_LANGUAGE;

    // return exact match
    return Array.from(matchedSpecies)[0];
  }

  /**
   * Retrieves the list of related languages for a given species.
   *
   * @param {string} specie - The name of the species to look up.
   * @returns {string[]} An array of related languages the species can communicate with.
   *                     Returns an empty array if no mapping is found.
   */
  getRelatedLanguages(specie: string): string[] {
    const mapping = this.languageMapping.find(map => map.specie === specie);
    return mapping ? mapping.speaksTo : [];
  }

  /**
   * Retrieves the list of all base species in the language mapping.
   *
   * @returns {string[]} An array containing the names of all species.
   */
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
    // Split the input text into words and punctuation while preserving their order
    let wordsAndPunctuation: string[] = text.trim().match(/[\w']+|[.!?]/g) || [];
    let translatedTokens: string[] = [];

    switch (toSpecie) {
      case LANGUAGE_OPTIONS.LABRADOR_LANGUAGE:
        translatedTokens = wordsAndPunctuation.map(word =>
          /[.!?]/.test(word) ? word : LANGUAGE_OPTIONS.LABRADOR_VOCABULARY
        );
        break;

      case LANGUAGE_OPTIONS.POODLE_LANGUAGE:
        translatedTokens = wordsAndPunctuation.map(word =>
          /[.!?]/.test(word) ? word : LANGUAGE_OPTIONS.POODLE_VOCABULARY
        );
        break;

      case LANGUAGE_OPTIONS.PARAKEET_LANGUAGE:
        translatedTokens = wordsAndPunctuation.map(word =>
          /^[aeiou]/i.test(word)
            ? LANGUAGE_OPTIONS.PARAKEET_VOCABULARY_TJILP
            : /[.!?]/.test(word)
              ? word
              : LANGUAGE_OPTIONS.PARAKEET_VOCABULARY_PEEP
        );
        break;

      case LANGUAGE_OPTIONS.PARROT_LANGUAGE: {
        const papegaaiTranslation: string[] = [];
        const prefix: string[] = LANGUAGE_OPTIONS.PARROT_VOCABULARY.match(/\w+|[^\w\s]/g) ?? [];
        let currentSentence: string[] = [];

        for (const token of wordsAndPunctuation) {
          if (/[.!?]/.test(token)) {
            // Add prefix and sentence if any words exist
            if (currentSentence.length) {
              papegaaiTranslation.push(...prefix, ...currentSentence);
              currentSentence = [];
            }
            papegaaiTranslation.push(token); // Add punctuation
          } else {
            currentSentence.push(token); // Collect tokens in the current sentence
          }
        }

        // Handle remaining sentence if no punctuation ends the input
        if (currentSentence.length) papegaaiTranslation.push(...prefix, ...currentSentence);
        
        // Update variables for final translation
        translatedTokens = papegaaiTranslation;
        wordsAndPunctuation = papegaaiTranslation;
        break;
      }

      default:
        return text;
    }

    // Properly join words and punctuation after translation
    let translatedText = '';
    let wordCount = 0;
    wordsAndPunctuation.forEach((token, index) => {
      const isPunctuation = /[:.!?]/.test(token);
      if (isPunctuation) {
        // Attach punctuation directly to the previous word without spaces
        if (/[:]/.test(token)) translatedText += ':';
        else translatedText += `${translatedTokens[index]}${drunk ? LANGUAGE_OPTIONS.HUMAN_DRUNK_VOCABULARY_CHEERS : ''}`
      } else {
        wordCount++;
        const currentToken = drunk && (wordCount) % 4 === 0 ? this.reverseWord(translatedTokens[index]) : translatedTokens[index];
        translatedText += `${translatedText ? ' ' : ''}${currentToken}`;
      }
    });

    if (drunk) translatedText += LANGUAGE_OPTIONS.HUMAN_DRUNK_VOCABULARY_BURP;

    return translatedText;
  }

  /**
   * Reverse a string
   *
   * @param {string} word - The input text to be reversed.
   * @returns {string} - The reversed input
   */
  private reverseWord(word: string): string {
    return word.split('').reverse().join('')
  }

}
