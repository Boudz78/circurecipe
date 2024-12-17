import { Component, HostListener, inject } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { PaginatorModule } from 'primeng/paginator'
import { MessageService, PrimeTemplate } from 'primeng/api'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { StepperModule } from 'primeng/stepper'
import { StepField } from '../../models/recipe.model'
import { RecipeStore } from '../../store/recipe.store'
import { RecipeService } from '../../services/recipe.service'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { CheckboxModule } from 'primeng/checkbox'
import { DividerModule } from 'primeng/divider'
import { RecipeCreatorHeaderComponent } from './recipe-creator-header/recipe-creator-header.component'
import { RecipeCreatorFooterComponent } from './recipe-creator-footer/recipe-creator-footer.component'

@Component({
  selector: 'recipe-creator',
  imports: [
    PaginatorModule,
    PrimeTemplate,
    ReactiveFormsModule,
    StepperModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
    RecipeCreatorHeaderComponent,
    RecipeCreatorFooterComponent,
  ],
  providers: [RecipeStore],
  templateUrl: './recipe-creator.component.html',
  standalone: true,
  styleUrl: './recipe-creator.component.scss',
})
export class RecipeCreatorComponent {
  private readonly VIEW_BREAKPOINT = 1023
  public screenView = this.getScreenView(window.innerWidth)
  recipeStore = inject(RecipeStore)
  messageService = inject(MessageService)
  recipeService = inject(RecipeService)
  formBuilder = inject(FormBuilder)
  recipeForm: FormGroup

  constructor() {
    this.recipeStore.loadRecipeConfig()
    this.recipeForm = this.formBuilder.group({
      name: ['', Validators.required],
      steps: this.formBuilder.array([]),
    })
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize(event: Event): void {
    this.screenView = this.getScreenView((event.target as Window).innerWidth)
  }

  private getScreenView(width: number): string {
    return width > this.VIEW_BREAKPOINT ? 'desktop' : 'mobile'
  }

  addStep(stepType: string) {
    if (!this.recipeStore.recipeConfig()) {
      console.error('Configuration not loaded.')
      return
    }

    const stepsArray = this.recipeForm.get('steps') as FormArray
    const stepForm = this.recipeService.createStepForm(
      stepType,
      this.recipeStore.recipeConfig(),
    )
    stepsArray.push(stepForm)
  }

  removeStep(index: number) {
    const stepsArray = this.recipeForm.get('steps') as FormArray
    if (stepsArray.length > index) {
      stepsArray.removeAt(index)
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        life: 3000,
        detail: 'Step Deleted Successfully',
      })
    }
  }

  exportRecipe() {
    this.recipeService.exportRecipe(this.recipeForm)
  }

  resetForm() {
    this.recipeService.resetForm(
      this.recipeForm,
      this.recipeStore.recipeConfig(),
    )
  }

  importRecipe(event: Event, didFinishCallBack: { emit: () => void }) {
    const input = event.target as HTMLInputElement
    const file = input?.files?.[0]
    if (!file || !this.recipeStore.recipeConfig()) return

    this.recipeService
      .importRecipe(file, this.recipeForm, this.recipeStore.recipeConfig())
      .then(() => didFinishCallBack.emit())
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          life: 3000,
          detail: error,
        })
      })
  }

  getFieldsForStep(stepType: any): StepField[] {
    return this.recipeStore.recipeConfig()?.steps[stepType]?.fields || []
  }

  isFieldVisible(field: StepField, formValue: any): boolean {
    return this.recipeService.isFieldVisible(field, formValue)
  }
}
