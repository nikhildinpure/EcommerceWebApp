import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName ?: string;
  userEmail ?: string;
  storage: Storage = sessionStorage;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth)  { }

 ngOnInit() {
  this.oktaAuth.authStateManager.subscribe(
    (res: any)  => {
      this.isAuthenticated = res.isAuthenticated ;
      if(this.isAuthenticated){
          this.oktaAuth.getUser().then(
            (res) => {
              console.log("login User => ");
              console.log(JSON.stringify(res));
              this.userFullName = res.name;
              this.userEmail = res.email;
              this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
              
            }
          ).catch((err) => {
            this.userFullName = "";
          });
      }else{
        this.isAuthenticated = false;
        this.userFullName = "";
      }
    }
  ); 


  }

  logout(){
    this.oktaAuth.signOut().then((res) => {
      this.isAuthenticated = false;
      this.userFullName = "";
      console.log(res);
    });
  }
    
  }

 
 


