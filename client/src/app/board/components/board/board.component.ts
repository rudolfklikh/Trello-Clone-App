import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  Observable,
  combineLatest,
  concatMap,
  filter,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Board } from 'src/app/shared/interfaces/board.interface';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { SocketEvents } from 'src/app/shared/enums/socket-events.enum';
import { ColumnsService } from 'src/app/shared/services/columns.service';
import { Column } from 'src/app/shared/interfaces/column.interface';
import { ColumnInput } from 'src/app/shared/interfaces/column-input.interface';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { Task } from 'src/app/shared/interfaces/task.interface';
import { TaskInput } from 'src/app/shared/interfaces/task-input.interface';

@Component({
  selector: 'el-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string;

  data$: Observable<{
    board: Board;
    columns: Column[];
  }>;

  constructor(
    private boardsService: BoardsService,
    private router: Router,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private tasksService: TasksService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }

    this.boardId = boardId;

    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
    ]).pipe(map(([board, columns]) => ({ board, columns })));
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEvents.BOARDS_JOIN, {
      boardId: this.boardId,
    });

    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<Column>(SocketEvents.COLUMNS_CREATE_SUCCESS)
      .subscribe((column: Column) => {
        this.boardService.addColumn(column);
      });

    this.socketService
      .listen<Task>(SocketEvents.TASK_CREATE_SUCCESS)
      .subscribe((task: Task) => {
          this.boardService.addTask(task);
      });
  }

  fetchData(): void {
    forkJoin([
      this.boardsService.getBoard(this.boardId),
      this.columnsService.getColumns(this.boardId),
    ]).pipe(
        tap(([board]) => this.boardService.setBoard(board)),
        switchMap(([_, columns]) => from(columns)),
        concatMap((column: Column) =>
          this.tasksService.getTasks(column.id).pipe(tap((tasks: Task[]) => this.boardService.addColumn({ ...column, tasks })))
        )
      ).subscribe();
  }

  createColumn(title: string): void {
    const columnInput: ColumnInput = {
      title,
      boardId: this.boardId,
    };

    this.columnsService.createColumn(columnInput);
  }

  createTask(title: string, columnId: string): void {
    const taskInput: TaskInput = {
      title,
      boardId: this.boardId,
      columnId
    };

    this.tasksService.createTask(taskInput);
  } 
}
