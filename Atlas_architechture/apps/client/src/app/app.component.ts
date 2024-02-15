import {Component} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {RouterModule} from '@angular/router';

import {NxWelcomeComponent} from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, MatChipsModule],
  selector: 'atlas-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
