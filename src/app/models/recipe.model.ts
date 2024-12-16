export interface StepField {
  key: string
  type: string
  label: string
  default: any
  options?: Array<{ label: string; value: string }>
  validators?: {
    min?: number
  }
  conditions?: {
    visibleIf?: {
      [key: string]: any
    }
  }
}

export interface Step {
  fields: StepField[]
}

export interface RecipeConfig {
  steps: Step[]
}
