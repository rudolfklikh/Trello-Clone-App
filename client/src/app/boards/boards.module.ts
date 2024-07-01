import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardsService } from '../shared/services/boards.service';
import { InlineFormComponent } from '../shared/components/inline-form/inline-form.component';
import { BoardsEmptyComponent } from './components/boards-empty/boards-empty.component';


@NgModule({
  declarations: [
    BoardsComponent
  ],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    InlineFormComponent,
    BoardsEmptyComponent
  ],
  providers: [
    BoardsService
  ]
})
export class BoardsModule { }
