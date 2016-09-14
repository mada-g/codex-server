import Router from 'koa-router';

import render from '../../utils/template-renderer.js';

import {userFromURL, findPage} from './middlewares.js';

export default function(userDB){
  let router = new Router();

  router.get('/signup', function *(next){
    //this.body = yield render('signup', {});
    this.body = yield render('identification', {title: 'Sign Up', postURL: "/signup", altRoute: "/login", altLabel: "sign in"})
  })

  router.get('/login', function *(next){

    this.body = yield render('identification', {title: 'Login', postURL: "/login", altRoute: "/signup", altLabel: "create account"})
    //this.body = yield render('login', {});
  })


  router.get('/view/:userid/:pageid', userFromURL, findPage(userDB), function *(next){
    console.log(this.req.userid);
    this.body = this.req.pageObj;
  })

  return router;

}
