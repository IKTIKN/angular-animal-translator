import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalTranslatorComponent } from './animal-translator.component';

describe('AnimalTranslatorComponent', () => {
  let component: AnimalTranslatorComponent;
  let fixture: ComponentFixture<AnimalTranslatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalTranslatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalTranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
