import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, viewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket.service';
import { AuthService } from './services/auth.service';
import { EAuthSubmitAction } from './auth.model';
import { CurrentUser } from './interfaces/current-user.interface';
import { LoginRequest } from './interfaces/login-request.interface';
import { RegisterRequest } from './interfaces/register-request.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  authContainer = viewChild.required<ElementRef<HTMLDivElement>>('auth');
  authSubmitActions = EAuthSubmitAction;
  errorMessage: string | null = null;

  signInForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  signUpForm = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  get userName(): FormControl {
    return this.signUpForm.controls.username;
  }

  get signUpEmail(): FormControl {
    return this.signUpForm.controls.email;
  }

  get signUpPassword(): FormControl {
    return this.signUpForm.controls.password;
  }

  get signInEmail(): FormControl {
    return this.signInForm.controls.email;
  }

  get signInPassword(): FormControl {
    return this.signInForm.controls.password;
  }



  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private socketService: SocketService
  ) {}

  togglePanel(): void {
    this.authContainer().nativeElement.classList.toggle('right-panel-active');
    this.clearForm();
  }

  onSubmit(submitAction: EAuthSubmitAction): void {
    if (submitAction === EAuthSubmitAction.SIGN_IN) {
      this.loginUser();
    }

    if (submitAction === EAuthSubmitAction.SIGN_UP) {
      this.registerUser();
    }
  }

  showError(formControl: FormControl): boolean {
    return formControl.invalid && (formControl.dirty || formControl.touched);
  }

  private loginUser(): void {
    if (!this.signInForm.valid) {
      return;
    }

    this.authService.login(this.signInForm.value as LoginRequest).subscribe({
      next: (user: CurrentUser) => {
        this.setupUser(user);
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = (err.error as Record<string, string>)[
          'emailOrPassword'
        ];
      },
    });
  }

  private registerUser(): void {
    if (!this.signUpForm.valid) {
      return;
    }

    this.authService
      .register(this.signUpForm.value as RegisterRequest)
      .subscribe({
        next: (user: CurrentUser) => {
          this.setupUser(user);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = (err.error as string[]).join(', ');
        },
      });
  }

  private setupUser(user: CurrentUser): void {
    this.authService.setToken(user);
    this.authService.setCurrentUser(user);
    this.socketService.setupSocketConnection(user);
    this.errorMessage = null;
  }

  private clearForm(): void {
    this.signUpForm.markAsUntouched();
    this.signUpForm.reset();

    this.signInForm.markAsUntouched();
    this.signInForm.reset();

    this.errorMessage = null;
  }
}

