import { Component } from '@angular/core';
import { AnimationOptions, LottieDirective } from 'ngx-lottie';

@Component({
  selector: 'app-boards-empty',
  standalone: true,
  imports: [LottieDirective],
  templateUrl: './boards-empty.component.html',
  styleUrl: './boards-empty.component.scss',
})
export class BoardsEmptyComponent {
  protected readonly lottieAnimationOptions: AnimationOptions = {
      path: 'assets/no-data.json',
  };
}
