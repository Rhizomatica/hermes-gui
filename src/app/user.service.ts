import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './user';
import { isBoolean } from 'util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService) { }

    users: User[];
    user: User;
    //private baseURL = 'http://floresta.hermes.radio:1011/api.php?p=2';
    private baseURL = 'http://localhost:8000/';
    
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'my-auth-token'
      })
    };
  
    getUsers(): Observable<User[]> {
      return this.http.get(this.baseURL + 'user/').pipe(
        map((res:any) => {
          this.users = res;
          console.log(this.users);
          return this.users;
      }),
      catchError(this.handleError));
    }

    getUser(): Observable<User[]> {
      return this.http.get(this.baseURL).pipe(
        map((res:any) => {
          this.user = res;
          console.log(this.user);
          return this.users;
      }),
      catchError(this.handleError));
    }

    /** DELETE: delete the user from the server */
    deleteUser(id: number): Observable<{}> {
      const url = `${this.baseURL}/user/${id}`; // DELETE api/users/42
      return this.http.delete(url, this.httpOptions)
        .pipe(
          //catchError(this.handleError('deleteUser'))
          catchError(this.handleError)
        );
    }

    /** POST: add a new user to the database */
    /*
    createUser(user: User): Observable<User> {
      const url = `${this.baseURL}/user`; // POST api/users
      return this.http.post<User>(url, user, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
}

    createUser(): Observable<User[]>{
    //post
    return this.users;

    }

    updateUser(): Observable<User[]>{
      //put
      }
*/
    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // Return an observable with a user-facing error message.
      return throwError(
        'Something bad happened; please try again later.');
    }

    private log (message: string) {
      this.alertService.add(`Users: ${message}`);
    }



}
