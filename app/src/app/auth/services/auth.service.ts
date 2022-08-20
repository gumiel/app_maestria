import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl
  private _usuario!: Usuario;

  get usuario(){
    return { ...this._usuario }
  }

  constructor(private http: HttpClient) { }

  /* crearUser(pName: string, pEmail: string, pPassword: string){
    const url = `${ this.baseUrl }/auth/new`;
    const body = { name: pName, email: pEmail, password: pPassword };
    return this.http.post(url,body)
  } */

  crearUser(pName: string, pEmail: string, pPassword: string){
    const url = `${ this.baseUrl }/auth/new`;
    const body = { name: pName, email: pEmail, password: pPassword };
    return this.http.post<AuthResponse>(url,body)
      .pipe(
        tap( resp => {
          if( resp.ok ){
            localStorage.setItem('token', resp.token!)
            this._usuario ={
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!
            }
          }
        }),
        map( resp => resp.ok ),
        // catchError( err => of( false ) )
        catchError( err => of( err.error ) )
      )
  }

  login( pEmail: string, pPassword: string){
    const url = `${ this.baseUrl }/auth`;
    const body = { email: pEmail, password: pPassword };

    return this.http.post<AuthResponse>( url, body)
    .pipe(
      tap( resp =>{
        //console.log(resp);
        if(resp.ok){
          localStorage.setItem('token', resp.token!)
          this._usuario ={
            name: resp.name!,
            uid: resp.uid!,
            email: resp.email!
          }

        }
      }),
      map( resp => resp.ok ),
     // catchError( err => of( false ) )
     catchError( err => of( err.error ) )
    )
  }

  /* validarToken(){
    const url = `${ this.baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
    .set('token', localStorage.getItem('token') || '')
    return this.http.get(url, { headers: headers})
  } */

  validarToken():Observable<boolean>{
    const url = `${ this.baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
                    .set('token', localStorage.getItem('token') || '')

    return this.http.get<AuthResponse>(url, { headers: headers})
            .pipe(
              map( resp =>{

                localStorage.setItem('token', resp.token!)
                this._usuario ={
                  name: resp.name!,
                  uid: resp.uid!,
                  email: resp.email!
                }

                return resp.ok;
              }),
              catchError( err => of(false))
            )
  }

  loguot(){
    localStorage.clear();
  }
}
