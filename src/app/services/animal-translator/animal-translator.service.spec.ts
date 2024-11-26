import { LANGUAGE_OPTIONS } from '../../strings/strings';
import { AnimalTranslatorService } from './animal-translator.service';

describe('AnimalTranslatorService', () => {
  let service: AnimalTranslatorService;

  beforeEach(() => {
    service = new AnimalTranslatorService();
  });

  describe('detectLanguage', () => {
    it('should detect Labrador language when all words match its vocabulary', () => {
      const sampleText = LANGUAGE_OPTIONS.LABRADOR_VOCABULARY;
      expect(service.detectLanguage(sampleText)).toEqual(LANGUAGE_OPTIONS.LABRADOR_LANGUAGE);
    });

    it('should detect human language when words are not in any vocabulary', () => {
      const sampleText = 'Hallo netpresenter!';
      expect(service.detectLanguage(sampleText)).toEqual(LANGUAGE_OPTIONS.HUMAN_LANGUAGE);
    });

    it('should return "Fout" when words match multiple species', () => {
      const sampleText = `${LANGUAGE_OPTIONS.LABRADOR_VOCABULARY} ${LANGUAGE_OPTIONS.PARAKEET_VOCABULARY_PEEP}`;
      console.log(sampleText, service.detectLanguage(sampleText))
      expect(service.detectLanguage(sampleText)).toEqual(LANGUAGE_OPTIONS.ERROR_DETECT_LANGUAGE);
    });

    it('should detect parakeet language with tjilp and peep vocabulary', () => {
      const sampleText = `${LANGUAGE_OPTIONS.PARAKEET_VOCABULARY_TJILP} ${LANGUAGE_OPTIONS.PARAKEET_VOCABULARY_PEEP}`;
      expect(service.detectLanguage(sampleText)).toEqual(LANGUAGE_OPTIONS.PARAKEET_LANGUAGE);
    });
  });

  describe('getRelatedLanguages', () => {
    it('should return related languages for Labrador', () => {
      expect(service.getRelatedLanguages(LANGUAGE_OPTIONS.LABRADOR_LANGUAGE)).toEqual([
        LANGUAGE_OPTIONS.POODLE_LANGUAGE,
        LANGUAGE_OPTIONS.PARROT_LANGUAGE,
      ]);
    });

    it('should return an empty array for an unknown species', () => {
      expect(service.getRelatedLanguages('UNKNOWN')).toEqual([]);
    });
  });

  describe('getAllSpecies', () => {
    it('should return all species in the language mapping', () => {
      expect(service.getAllSpecies()).toEqual([
        LANGUAGE_OPTIONS.HUMAN_LANGUAGE,
        LANGUAGE_OPTIONS.LABRADOR_LANGUAGE,
        LANGUAGE_OPTIONS.POODLE_LANGUAGE,
        LANGUAGE_OPTIONS.PARAKEET_LANGUAGE,
      ]);
    });
  });

  describe('translate', () => {
    it('should translate text to Labrador language', () => {
      const input = 'Hello world!';
      const result = service.translate(input, LANGUAGE_OPTIONS.LABRADOR_LANGUAGE, false);
      expect(result).toEqual('woef woef!');
    });

    it('should translate text to Poodle language', () => {
      const input = 'Hello world.';
      const result = service.translate(input, LANGUAGE_OPTIONS.POODLE_LANGUAGE, false);
      expect(result).toEqual('woefie woefie.');
    });

    it('should translate text to Parakeet language with vowel rules', () => {
      const input = 'Apple Banana Cherry.';
      const result = service.translate(input, LANGUAGE_OPTIONS.PARAKEET_LANGUAGE, false);
      expect(result).toEqual('tjilp piep piep.');
    });

    it('should translate text to Parrot language with prefix', () => {
      const input = 'Hello world!';
      const result = service.translate(input, LANGUAGE_OPTIONS.PARROT_LANGUAGE, false);
      expect(result).toEqual('Ik praat je na: Hello world!');
    });

    it('should translate text to Labrador language with drunk mode enabled', () => {
      const input = 'Hello my dear world!';
      const result = service.translate(input, LANGUAGE_OPTIONS.LABRADOR_LANGUAGE, true);
      expect(result).toContain('woef');
    });
  });
});
