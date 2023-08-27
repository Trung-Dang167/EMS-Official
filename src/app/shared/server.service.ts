import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../login/User'
import { first, catchError } from 'rxjs/operators'
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';
import { Data } from '../dashboard/dashboardInfo';
import { gasBound } from '../setting/gasComponent';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: Pick<User, "id">;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 
      "Content-Type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'GET,OPTION,POST,PUT',
      'Access-Control-Allow-Headers':'Origin, Accept, X-Requested-With, Content-Type, Authorization',
    })
  }

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    private noti: NotificationService
  ) { }

  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('http://localhost:3000/dashboard', {responseType: 'json'})
    .pipe(
      catchError(this.errorHandlerService.handleError<Data[]>('fetchAll', []))
    );
  }

  getStat(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/statistics', {responseType: 'json'})
    .pipe(
      catchError(this.errorHandlerService.handleError<any>('fetchStat', []))
    );
  }

  update(data: Data): Observable<any> {
    return this.http.put('http://localhost:3000/dashboard', data, this.httpOptions)
    .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  customize(data: gasBound): Observable<any> {
    return this.http.put('http://localhost:3000/customize', data, this.httpOptions)
    .pipe(catchError(this.errorHandlerService.handleError<any>("update")));
  }

  login(
    username: Pick<User, "username">,
    password: Pick<User, "password">
  ): Observable<{
    token: string;
    userId: Pick<User, 'id'>;
  }> {
    return this.http.post<{
      token: string;
      userId: Pick<User, "id">;
    }>
      ('http://localhost:3000/auth/login', { username, password }, this.httpOptions)
      .pipe(
        first(), tap((tokenObject: { token: string; userId: Pick<User, "id"> }) => {
          this.userId = tokenObject.userId
          localStorage.setItem("token", tokenObject.token)
          this.isUserLoggedIn$.next(true)
          this.noti.openSnackBar("Success")
          this.router.navigate(['dashboard'])
        }),
        catchError(
          this.errorHandlerService.handleError<{
            token: string; userId: Pick<User, 'id'>
          }>("login"))
      )
  }

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>('http://localhost:3000/auth/signup', user, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<User>("signup"))
    )
  }
}
  