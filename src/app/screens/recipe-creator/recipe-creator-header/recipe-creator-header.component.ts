import { Component, input } from '@angular/core'

@Component({
  selector: 'recipe-header',
  templateUrl: './recipe-creator-header.component.html',
  styleUrl: './recipe-creator-header.component.scss',
  standalone: true,
})
export class RecipeCreatorHeaderComponent {
  title = input<string>()
  description = input<string>()
  showImage = input<boolean>()
}
