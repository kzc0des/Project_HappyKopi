import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.development';
import { UserDto } from './user-dto';
import { UserForLoginDto } from './user-for-login-dto';
import { LoginResponseDto } from './login-response-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api: string = environment.apiBaseUrl + '/Users';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<UserDto | null>(null);

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      this.loadCurrentUser();
    }
  }

  login(user: UserForLoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.api}/LoginUser`, user).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
          this.currentUser.next(response.user);
          this.loadCurrentUser(); // Re-load from token for consistency
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser$(): Observable<UserDto | null> {
    return this.currentUser.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const expiry = decodedToken.exp;
        if (Date.now() >= expiry * 1000) {
          this.logout();
          return;
        }
        const user: UserDto = {
          id: decodedToken['nameid'],
          username: decodedToken['unique_name'],
          role: decodedToken['role'],
          isActive: true, // Assuming default, token might not have this
        };
        this.currentUser.next(user);
        this.loggedIn.next(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }
}