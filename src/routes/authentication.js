import Router from 'koa-router';
import koaBody from 'koa-body';

export default function(passport){
  let router = new Router();

  router.post('/signup', koaBody(), passport.authenticate('local-signup', {
    failureRedirect: '/signup',
    successRedirect: '/editor'
  }))

  router.post('/login', koaBody(),
    passport.authenticate('local-login', {failureRedirect: '/login'}),
      function *(next){
        this.redirect(`/editor`);
      }
  )

  return router;
}
