import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/shared/interfaces/board.interface';
import { BoardsService } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  boards: Board[] = [];

  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
    });
  }
}
