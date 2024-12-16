import { inject, Injectable } from '@angular/core'
import { UIStore } from '../store/ui.store'

@Injectable({
  providedIn: 'root',
})
export class UiService {
  uiStore = inject(UIStore)

  toggleTheme() {
    this.uiStore.toggleTheme()
    const newTheme = this.uiStore.isDarkMode() ? 'dark' : 'light'
    console.log(newTheme)
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement
    if (themeLink) {
      console.log(themeLink)
      themeLink.href = newTheme + '.css'
    }
  }
}
