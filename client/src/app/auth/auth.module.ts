import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({ declarations: [
        LoginComponent,
        RegisterComponent
    ], imports: [CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        RouterModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AuthModule { }
