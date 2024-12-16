import { Component, input, TemplateRef } from '@angular/core'
import { Button } from 'primeng/button'
import { NgTemplateOutlet } from '@angular/common'

@Component({
  selector: 'recipe-footer',
  imports: [Button, NgTemplateOutlet],
  standalone: true,
  templateUrl: './recipe-creator-footer.component.html',
  styleUrl: './recipe-creator-footer.component.scss',
})
export class RecipeCreatorFooterComponent {
  leftTemplate = input<TemplateRef<any>>()
  rightTemplate = input<TemplateRef<any>>()
}
