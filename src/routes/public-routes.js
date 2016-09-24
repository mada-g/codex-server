import Router from 'koa-router';

import render from '../../utils/template-renderer.js';
import {userFromURL, findPage} from './middlewares.js';
import pageviewer from '../pageviewer/index.js';

import currentDate from '../../utils/date.js';


export default function(userDB){
  let router = new Router();

  router.get('/signup', function *(next){
    let status = this.request.query['status'];

    let msg = '';
    let style = '';

    if(status === 'format'){
      msg = "username and password must contain only letters and numbers";
      style = "err";
    }
    else if(status === 'invalidu'){
      msg = "username already exists";
      style = "err";
    }

    //this.body = yield render('signup', {});
    this.body = yield render('identification', {title: 'Sign Up', postURL: "/signup", altRoute: "/login", altLabel: "I have an account", status:{msg, style}})
  })

  router.get('/login', function *(next){

    let status = this.request.query['status'];

    let msg = '';
    let style = '';

    if(status === 'format'){
      msg = "username and password must contain only letters and numbers";
      style = "err";
    }
    else if(status === 'invalidu'){
      msg = "username does not exist";
      style = "err";
    }
    else if(status ==='invalidp'){
      msg = "wrong password";
      style = "err";
    }

    this.body = yield render('identification', {title: 'Login', postURL: "/login", altRoute: "/signup", altLabel: "create account", status: {msg, style}})
    //this.body = yield render('login', {});
  })


  router.get('/view/:userid/:pageid', function *(next){

    let doc = yield userDB.getFields({username: this.params.userid, "journalCollection.pageid": this.params.pageid}, {"journalCollection.$": 1});

    let pageData = doc['journalCollection'][0];

    let _pageData = {};

    for(let k in pageData){
      _pageData[k] = k==="items" ? JSON.parse(pageData[k]) : pageData[k];
    }


    console.log(currentDate());

    console.log(_pageData);

    this.body = pageviewer(_pageData, {auth: this.params.userid});

  })

  return router;

}
