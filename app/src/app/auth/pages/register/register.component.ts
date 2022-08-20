import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private router: Router,
              private _authService: AuthService) { }

  miFormulario : FormGroup =this.fb.group({
    name: ['test1',[Validators.required]],
    email: ['test1@gmail.com', [ Validators.required, Validators.email ]],
    password: ['2fdf34', [ Validators.required, Validators.minLength(6) ]],
  })
  ngOnInit(): void {
  }

  registrar(){
    console.log("regsitrar");
    /* console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);
    this.router.navigateByUrl('/dashboart') */
    const { name, email, password } = this.miFormulario.value;
    this._authService.crearUser(name, email, password)
      .subscribe( resp => {
        console.log("RESPONSE",resp);
        if( resp === true ){
          this.router.navigateByUrl('/dashboart') 
        }else{
          Swal.fire('Error', resp.msg, 'error');
        }
      })
      
  }
}
