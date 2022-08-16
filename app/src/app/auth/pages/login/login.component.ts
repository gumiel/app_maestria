import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    email: ['test1@gmail.com', [ Validators.required, Validators.email ]],
    password: ['2fdf34', [ Validators.required, Validators.minLength(6) ]],
  })

  constructor( private fb: FormBuilder,
              private router: Router,
              private authService: AuthService ) { }

  ngOnInit(): void {
  }

  login(){
    //console.log(this.miFormulario.value);
    const { email, password } = this.miFormulario.value;

    this.authService.login( email, password )
    .subscribe( ok =>{
      console.log("OK", ok);
      if(ok === true){
        this.router.navigateByUrl('/dashboart')  
      }else{
        Swal.fire('Error', ok.msg, 'error')
      }
    })
    /* .subscribe(resp =>{
      console.log(resp);
    }) */
    //console.log(this.miFormulario.value);
    //console.log(this.miFormulario.valid);
    //this.router.navigateByUrl('/dashboart')
    /* this.authService.validarToken()
      .subscribe( resp => console.log(resp)) */
  }

}
