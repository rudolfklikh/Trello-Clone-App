import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Board } from 'src/app/shared/interfaces/board.interface';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.scss'
})
export class BoardCardComponent {
  readonly board = input.required<Board>();
}
