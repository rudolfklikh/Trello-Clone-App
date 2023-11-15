import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardsService } from '../shared/services/boards.service';
import { InlineFormComponent } from '../shared/components/inline-form/inline-form.component';
import { TopbarComponent } from '../shared/components/topbar/topbar.component';
import { BoardModule } from '../board/board.module';


@NgModule({
  declarations: [
    BoardsComponent
  ],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    InlineFormComponent,
    TopbarComponent,
  ],
  providers: [
    BoardsService
  ]
})
export class BoardsModule { }
