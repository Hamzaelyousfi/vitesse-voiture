import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculFormComponent } from './calcul-form.component';

describe('CalculFormComponent', () => {
  let component: CalculFormComponent;
  let fixture: ComponentFixture<CalculFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
