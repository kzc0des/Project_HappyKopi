import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDto } from '../../dtos/auth/user-dto';
import { HttpClient } from '@angular/common/http';
import { UserForLoginDto } from '../../dtos/auth/user-for-login-dto';
import { LoginResponseDto } from '../../dtos/auth/login-response-dto';
import { environment } from '../../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api: string = environment.apiBaseUrl + "/Users";

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<UserDto | null>(null);

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      this.loadCurrentUser();
    }
  }

  login(user: UserForLoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.api}/LoginUser`, user)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            this.loggedIn.next(true);
            this.currentUser.next(response.user);
            this.loadCurrentUser();
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

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser$(): Observable<UserDto | null> {
    return this.currentUser.asObservable();
  }

  getUserRole(): 'Admin' | 'Barista' | null {
    const user = this.currentUser.getValue();
    return user?.role as 'Admin' | 'Barista' | null;
  }

  loadCurrentUser(): void {
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
          isActive: true 
        };

        this.currentUser.next(user);
        this.loggedIn.next(true);

      } catch (error) {
        console.error("Error decoding token:", error);
        this.logout(); 
      }
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }
}
