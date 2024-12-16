import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCreatorFooterComponent } from './recipe-creator-footer.component';

describe('RecipeCreatorFooterComponent', () => {
  let component: RecipeCreatorFooterComponent;
  let fixture: ComponentFixture<RecipeCreatorFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCreatorFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeCreatorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
