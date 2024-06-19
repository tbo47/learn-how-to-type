import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLocaleDropdownComponent } from './change-locale-dropdown.component';

describe('ChangeLocaleDropdownComponent', () => {
  let component: ChangeLocaleDropdownComponent;
  let fixture: ComponentFixture<ChangeLocaleDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLocaleDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeLocaleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
