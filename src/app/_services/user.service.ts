import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../user';
// import { isBoolean } from 'util';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService) { }

    users: User[];
    user: User;

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'my-auth-token'
      })
    };

    getUsers(): Observable<User[]> {
      return this.http.get(GlobalConstants.apiURL + '/user').pipe(
        map((res: any) => {
          this.users = res;
          console.log("⚚ user service: ", this.users);
          return this.users;
      }),
      catchError(this.handleError));
    }

    /* getUser(id: number): Observable<User[]> {
      const url = `${GlobalConstants.apiURL}/user/${id}`; // DELETE api/users/42
      return this.http.get(this.url.pipe(
        map((res: any) => {
          this.user = res;
          return this.users;
      }),
      catchError(this.handleError));
    }*/

    /** DELETE: delete the user from the server */
    deleteUser(id: number): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/user/${id}`; // DELETE api/users/42
      console.log(url);
      return this.http.delete(url)
        .pipe(
          catchError(this.handleError));
    }

    /** POST: add a new user to the database */
    createUser(user: User): Observable<User> {
      const url = `${GlobalConstants.apiURL}/user`; // POST api/users
      // console.log(url);
      // console.log(user);
      // return this.http.post<User>(url, user, httpOptions)
      return this.http.post<User>(url, user, this.httpOptions)
       .pipe(
        catchError(this.handleError)
      );
    }


  /** POST: update a user  */
    updateUser(id: number, user: User): Observable<User> {
      const url = `${GlobalConstants.apiURL}/user/${id}`; // PUT api/users/42
      return this.http.post<User>(url, user, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('⚚An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // Return an observable with a user-facing error message.
      this.users = [];
      return throwError(
        'Something bad happened; please try again later.');
    }

    private log(message: string) {
      this.alertService.add(`Users: ${message}`);
    }

}
