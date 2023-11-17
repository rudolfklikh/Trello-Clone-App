import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketEvents } from 'src/app/shared/enums/socket-events.enum';
import { Board } from 'src/app/shared/interfaces/board.interface';
import { Column } from 'src/app/shared/interfaces/column.interface';
import { Task } from 'src/app/shared/interfaces/task.interface';
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
  
  addTask(task: Task): void {
    const columnIndx = this.columns$.getValue().findIndex(col => col.id === task.columnId);

    if (columnIndx !== -1) {
      const updatedColumn = this.columns$.getValue()[columnIndx];

      updatedColumn.tasks?.push(task);

      this.columns$.getValue().splice(columnIndx, 1, updatedColumn);
      this.columns$.next([...this.columns$.getValue()]);
    }
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEvents.BOARDS_LEAVE, { boardId })
  }
  
}
