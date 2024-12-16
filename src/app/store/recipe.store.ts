import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals'
import { computed, inject } from '@angular/core'
import { RecipeService } from '../services/recipe.service'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { RecipeConfig } from '../models/recipe.model'
import { pipe, switchMap, tap } from 'rxjs'
import { tapResponse } from '@ngrx/operators'

interface RecipeState {
  recipeConfig: RecipeConfig | undefined
}

const recipeInitialState: RecipeState = {
  recipeConfig: undefined,
}

export const RecipeStore = signalStore(
  withState(recipeInitialState),
  withComputed(({ recipeConfig }) => ({
    availableRecipes: computed(() => {
      const config = recipeConfig()
      if (!config || typeof config !== 'object') {
        return []
      }
      return Object.keys(config.steps)
    }),
  })),
  withMethods((store, recipeService = inject(RecipeService)) => ({
    loadRecipeConfig: rxMethod<void>(
      pipe(
        switchMap(() =>
          recipeService.fetchConfig().pipe(
            tapResponse({
              next: (RecipeConfig: RecipeConfig) =>
                patchState(store, { recipeConfig: RecipeConfig }),
              error: err => {
                patchState(store, { recipeConfig: undefined })
              },
            }),
          ),
        ),
      ),
    ),
  })),
)
