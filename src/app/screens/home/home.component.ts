import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
