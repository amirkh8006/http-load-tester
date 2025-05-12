import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeyFormComponent } from './hey-form.component';

describe('HeyFormComponent', () => {
  let component: HeyFormComponent;
  let fixture: ComponentFixture<HeyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
