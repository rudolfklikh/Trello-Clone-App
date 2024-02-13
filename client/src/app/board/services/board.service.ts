import { moveItemInArray } from '@angular/cdk/drag-drop';
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

  setTasks(tasks: Task[], columnID: string): void {
    const columnIndex = this.columns$.getValue().findIndex(col => col.id === columnID);

    if (columnIndex !== -1) {
      const updatedColumn = this.columns$.getValue()[columnIndex];
      const columns = [...this.columns$.getValue()];

      columns.splice(columnIndex, 1, { ...updatedColumn, tasks });

      this.columns$.next(columns);
    }
  }

  addColumn(column: Column): void {
    const columns = [...(this.columns$.getValue() ?? [])];
    const isColumnExist = !!columns.find(col => col.id === column.id);
    
    if (!isColumnExist) {
      this.columns$.next([...this.columns$.getValue(), column]);
    }
  }
  
  addTask(task: Task): void {
    const columnIndx = this.columns$.getValue().findIndex(col => col.id === task.columnId);

    if (columnIndx !== -1) {
      const updatedColumn = this.columns$.getValue()[columnIndx];
      const columns = [...this.columns$.getValue()];
      const tasks = [...(updatedColumn.tasks ?? [])];
      const isTaskExist = !!tasks.find(t => t.id === task.id);

      if (!isTaskExist) {
        columns.splice(columnIndx, 1, { ...updatedColumn, tasks: [...(updatedColumn.tasks ?? []), task] });
        this.columns$.next(columns);
      }
    }
  }

  updateColumn(column: Column, previousIndex: number, currentIndex: number): void {
    const columns = [...(this.columns$.getValue() ?? [])];
    const columnIndex = columns.findIndex(col => col.id === column.id);

    if (columnIndex !== -1) {
      moveItemInArray(columns, previousIndex, currentIndex);

      this.columns$.next(columns);
    }
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.columns$.next([]);

    this.socketService.emit(SocketEvents.BOARDS_LEAVE, { boardId })
  }
  
}
