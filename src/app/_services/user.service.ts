import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  getUsers(): Observable<User[]> {
    return this.http.get(GlobalConstants.apiURL + '/user').pipe(
      map((res: any) => res),
      catchError(this.handleError));
  }

  getUser(id: string): Observable<User> {
    return this.http.get(GlobalConstants.apiURL + '/user/' + id).pipe(
      map((res: any) => res.message),
      catchError(this.handleError));
  }

  /** DELETE: delete the user from the server */
  deleteUser(id: number, email: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/user/${id}/${email}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError));
  }

  /** POST: add a new user to the database */
  createUser(user: User): Observable<User> {
    const url = `${GlobalConstants.apiURL}/user`;

    return this.http.post<User>(url, user, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /** POST: update a user  */
  updateUser(id: number, user: User): Observable<User> {
    const url = `${GlobalConstants.apiURL}/user/${id}`;
    return this.http.post<User>(url, user, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
