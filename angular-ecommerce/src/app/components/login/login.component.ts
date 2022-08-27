import { Component, Inject, OnInit } from '@angular/core';

import {  OKTA_AUTH } from '@okta/okta-angular';
import myAppConfig from 'src/app/config/my-app-config';
import { OktaAuth , SigninWithRedirectOptions} from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

const DEFAULT_ORIGINAL_URI = window.location.origin;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signIn: any;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
  this.signIn = new OktaSignIn({
    baseUrl: myAppConfig.oidc.issuer?.split('/oauth2')[0],
    clientId: myAppConfig.oidc.clientId,
    redirectUri: myAppConfig.oidc.redirectUri,
    logo: '/assets/images/shop.png',
    i18n: {
      en: {
        'primaryauth.title': 'Angular-Spring Ecommerce',
      },
    },
    authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
    },
  });
}

ngOnInit() {
  this.signIn.remove();

  this.signIn.renderEl({

    el: '#sign-in-widget'}, // this name should be same as div tag id in login.component.html

    (response:any) => {

      if (response.status === 'SUCCESS') {

        this.oktaAuth.signInWithRedirect();

      }

    },

    (error:any) => {
      console.log("failed to load login component")
      throw error;

    }

  );

 }

}

