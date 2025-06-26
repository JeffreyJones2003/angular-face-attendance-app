import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRecognizerComponent } from './face-recognizer.component';

describe('FaceRecognizerComponent', () => {
  let component: FaceRecognizerComponent;
  let fixture: ComponentFixture<FaceRecognizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceRecognizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaceRecognizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
