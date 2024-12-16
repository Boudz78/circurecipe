import { Routes } from '@angular/router'
import { HomeComponent } from './screens/home/home.component'
import { RecipeCreatorComponent } from './screens/recipe-creator/recipe-creator.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'recipe-creator',
    component: RecipeCreatorComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
]
