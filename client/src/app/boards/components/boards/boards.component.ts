import { Component, OnInit, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { Board } from 'src/app/shared/interfaces/board.interface';
import { BoardsService } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent {
  private readonly boardsService = inject(BoardsService);
  protected boards: Signal<Board[] | undefined> = toSignal(this.boardsService.getBoards().pipe(take(1)));

  // createBoard(title: string): void {
  //   this.boardsService.createBoard(title).pipe(take(1)).subscribe((createdBoard) => {
  //     this.boards = [...this.boards, createdBoard];
  //   });
  // }
}
