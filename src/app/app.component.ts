import { AfterViewInit, Component, effect, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { RouterOutlet } from '@angular/router'
import { StepperModule } from 'primeng/stepper'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { SidebarModule } from 'primeng/sidebar'
import { UIStore } from './store/ui.store'
import { UiService } from './services/ui.service'

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    StepperModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    SidebarModule,
  ],
  providers: [UIStore, UiService, MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements AfterViewInit {
  httpClient = inject(HttpClient)
  uiStore = inject(UIStore)
  uiService = inject(UiService)
  screwSVG: string = ''

  constructor() {
    this.loadScrewSVG()
  }

  ngAfterViewInit(): void {
    const container = document.getElementById('screw-container')
    const interval = 300
    let lastTimestamp = 0

    const createMovingScrew = () => {
      if (!this.screwSVG) return

      const screw = document.createElement('div')
      screw.innerHTML = this.screwSVG
      screw.style.position = 'absolute'
      screw.style.top = `${Math.random() * 100}%`
      screw.style.left = Math.random() > 0.5 ? '-10%' : '110%'
      screw.style.animation = `move 10s linear`
      container?.appendChild(screw)
      screw.addEventListener('animationend', () => {
        screw.remove()
      })
    }

    const animationLoop = (timestamp: number) => {
      if (timestamp - lastTimestamp >= interval) {
        createMovingScrew()
        lastTimestamp = timestamp
      }
      requestAnimationFrame(animationLoop)
    }
    requestAnimationFrame(animationLoop)
  }

  private loadScrewSVG(): void {
    const svgPath = './screw.svg' // Adjust path if necessary
    this.httpClient.get(svgPath, { responseType: 'text' }).subscribe({
      next: svgContent => {
        this.screwSVG = svgContent
      },
      error: err => {
        console.error('Failed to load SVG:', err)
      },
    })
  }
}
