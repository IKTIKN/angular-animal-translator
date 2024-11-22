import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputTextAreaComponent } from './output-text-area.component';

describe('OutputTextAreaComponent', () => {
  let component: OutputTextAreaComponent;
  let fixture: ComponentFixture<OutputTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputTextAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
