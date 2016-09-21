import Router from 'koa-router';
import koaBody from 'koa-body';

import {authenticate} from './middlewares';

export default function(passport){
  let router = new Router();

  router.post('/signup', koaBody(), authenticate(passport, 'signup'));

  router.post('/login', koaBody(), authenticate(passport, 'login'));
    /*{failureRedirect: '/login', failureFlash: true}),
      function *(next){
        this.redirect(`/editor`);
      }*/

  return router;
}
