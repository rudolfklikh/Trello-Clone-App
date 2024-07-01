import { Component, OnInit, inject } from '@angular/core';
import { take } from 'rxjs';
import { Board } from 'src/app/shared/interfaces/board.interface';
import { BoardsService } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  private readonly boardsService = inject(BoardsService);

  boards: Board[] = [];

  ngOnInit(): void {
    this.boardsService.getBoards().pipe(take(1)).subscribe((boards) => this.boards = boards);
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).pipe(take(1)).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
    });
  }
}
