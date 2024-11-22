import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-output-text-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './output-text-area.component.html',
  styleUrl: './output-text-area.component.css'
})
export class OutputTextAreaComponent {
  @Input() text: string = '';
  @Input() specie: string = '';

  formattedText: string[][] = [];

  resizeListener: () => void = () => {};

  /**
   * Lifecycle hook that is called when the component is initialized.
   * It splits the input text into lines and sets up a resize listener to update the lines when the window size changes.
   */
  ngOnInit(): void {
    this.splitTextIntoLines(this.text);
    this.resizeListener = () => this.splitTextIntoLines(this.text);
    window.addEventListener('resize', this.resizeListener);
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * It removes the resize listener to avoid memory leaks.
   */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  /**
   * Lifecycle hook that is called when any input properties of the component change.
   * It triggers a re-split of the input text whenever the `text` property changes.
   */
  ngOnChanges(): void {
    this.splitTextIntoLines(this.text);
  }

  /**
   * Splits the input text into an array of lines, each containing up to a maximum of `maxWordsPerLine` words.
   * It adjusts the number of words per line based on the screen size (tablet or larger).
   * 
   * @param {string} input - The input text to be split into lines.
   */
  splitTextIntoLines(input: string) {
    const words = input.split(' ');
    const maxWordsPerLine = 10;
    this.formattedText = [];

    const isWideScreen = window.innerWidth >= 640;

    if (isWideScreen && this.specie === 'Parkiet') {
      for (let i = 0; i < words.length; i += maxWordsPerLine) {
        this.formattedText.push(words.slice(i, i + maxWordsPerLine));
      }
    } else {
      this.formattedText.push(words);
    }
  }

  /**
   * Returns a TailwindCSS class for text color based on the index.
   * The colors alternate between red, green, yellow, and blue.
   * 
   * @param {number} index - The index of the word or line, used to determine the color.
   * @returns {string} - The CSS class for the text color.
   */
  getColorClass(index: number): string {
    const colors = ['text-red-500', 'text-green-500', 'text-yellow-500', 'text-blue-500'];
    return colors[index % colors.length];
  }
  
}
