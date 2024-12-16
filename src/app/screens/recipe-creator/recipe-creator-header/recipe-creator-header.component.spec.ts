import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCreatorHeaderComponent } from './recipe-creator-header.component';

describe('RecipeCreatorHeaderComponent', () => {
  let component: RecipeCreatorHeaderComponent;
  let fixture: ComponentFixture<RecipeCreatorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCreatorHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeCreatorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
