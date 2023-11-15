import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { BoardRoutingModule } from './board-routing.module';
import { BoardService } from './services/board.service';
import { ColumnsService } from '../shared/services/columns.service';
import { TopbarComponent } from '../shared/components/topbar/topbar.component';
import { InlineFormComponent } from '../shared/components/inline-form/inline-form.component';


@NgModule({
  declarations: [
    BoardComponent
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    TopbarComponent,
    InlineFormComponent
  ],
  providers: [BoardService, ColumnsService]
})
export class BoardModule { }
