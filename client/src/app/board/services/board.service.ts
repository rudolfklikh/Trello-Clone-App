import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketEvents } from 'src/app/shared/enums/socket-events.enum';
import { Board } from 'src/app/shared/interfaces/board.interface';
import { Column } from 'src/app/shared/interfaces/column.interface';
import { SocketService } from 'src/app/shared/services/socket.service';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<Board | null>(null);
  columns$ = new BehaviorSubject<Column[]>([]);
  
  constructor(private socketService: SocketService) { }


  setBoard(board: Board): void {
    this.board$.next(board);
  }

  setColumns(columns: Column[]): void {
    this.columns$.next(columns);
  }

  addColumn(column: Column): void {
    this.columns$.next([...this.columns$.getValue(), column]);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEvents.BOARDS_LEAVE, { boardId })
  }
  
}
