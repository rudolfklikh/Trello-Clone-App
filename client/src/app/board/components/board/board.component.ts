import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable, combineLatest, filter, forkJoin, map } from 'rxjs';
import { Board } from 'src/app/shared/interfaces/board.interface';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { SocketEvents } from 'src/app/shared/enums/socket-events.enum';
import { ColumnsService } from 'src/app/shared/services/columns.service';
import { Column } from 'src/app/shared/interfaces/column.interface';
import { ColumnInput } from 'src/app/shared/interfaces/column-input.interface';

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
    private columnsService: ColumnsService
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
  }

  fetchData(): void {
    forkJoin([
      this.boardsService.getBoard(this.boardId),
      this.columnsService.getColumns(this.boardId),
    ]).subscribe(([board, columns]) => {
      this.boardService.setBoard(board);
      this.boardService.setColumns(columns);
    });
  }

  createColumn(title: string): void {
    const columnInput: ColumnInput = {
      title,
      boardId: this.boardId,
    };

    this.columnsService.createColumn(columnInput);
  }
}
