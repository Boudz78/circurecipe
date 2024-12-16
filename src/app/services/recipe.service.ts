import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { RecipeConfig, StepField } from '../models/recipe.model'
import { HttpClient } from '@angular/common/http'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private httpClient = inject(HttpClient)
  private formBuilder = inject(FormBuilder)

  // Fetch Recipe Configuration
  fetchConfig(): Observable<RecipeConfig> {
    return this.httpClient.get<RecipeConfig>('./config.json')
  }

  // Create Form Controls Dynamically
  createStepForm(stepType: any, config: RecipeConfig | undefined): FormGroup {
    const stepDefinition = config?.steps[stepType]
    if (!stepDefinition) {
      throw new Error(`No configuration found for step type: ${stepType}`)
    }

    const fieldControls: { [key: string]: FormControl } = {}
    stepDefinition.fields.forEach(field => {
      const validators = this.mapValidators(field.validators)
      fieldControls[field.key] = new FormControl(field.default, validators)
    })

    return this.formBuilder.group({
      stepType: [stepType, Validators.required],
      ...fieldControls,
    })
  }

  // Map Validators from Config
  mapValidators(validatorsConfig?: { [key: string]: any }): ValidatorFn[] {
    if (!validatorsConfig) return []
    const validatorFns: ValidatorFn[] = []

    if (validatorsConfig['required']) {
      validatorFns.push(Validators.required)
    }
    if (validatorsConfig['min'] !== undefined) {
      validatorFns.push(Validators.min(validatorsConfig['min']))
    }
    if (validatorsConfig['max'] !== undefined) {
      validatorFns.push(Validators.max(validatorsConfig['max']))
    }
    if (validatorsConfig['pattern']) {
      validatorFns.push(Validators.pattern(validatorsConfig['pattern']))
    }
    return validatorFns
  }

  // Import Recipe
  importRecipe(
    file: File,
    recipeForm: FormGroup,
    config: RecipeConfig | undefined,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        try {
          const importedData = JSON.parse(e.target.result)

          if (importedData?.steps?.length === 0) {
            throw new Error(
              'The import function requires one step atleast to be imported.',
            )
          }

          if (!importedData.name || !Array.isArray(importedData.steps)) {
            throw new Error('Invalid recipe JSON structure.')
          }

          recipeForm.reset()
          const stepsArray = recipeForm.get('steps') as FormArray
          stepsArray.clear()

          importedData.steps.forEach((step: any) => {
            const stepForm = this.createStepForm(step.stepType, config)
            stepsArray.push(stepForm)
            stepsArray.controls[stepsArray.length - 1].patchValue(step)
          })

          recipeForm.get('name')?.setValue(importedData.name)
          resolve()
        } catch (error) {
          reject(error)
        }
      }

      reader.readAsText(file)
    })
  }

  // Reset Form
  resetForm(recipeForm: FormGroup, config: RecipeConfig | undefined): void {
    recipeForm.reset()
    const stepsArray = recipeForm.get('steps') as FormArray
    stepsArray.clear()
    recipeForm.get('name')?.setValue('')
  }

  // Export Recipe
  exportRecipe(recipeForm: FormGroup): void {
    const recipeData = recipeForm.value
    const jsonData = JSON.stringify(recipeData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${recipeData.name || 'recipe'}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Visibility Logic
  isFieldVisible(field: StepField, formValue: any): boolean {
    if (!field.conditions || !field.conditions.visibleIf) return true

    const conditions = field.conditions.visibleIf
    return Object.keys(conditions).every(
      depKey => formValue[depKey] === conditions[depKey],
    )
  }
}
