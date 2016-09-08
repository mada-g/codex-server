import Router from 'koa-router';
import koaBody from 'koa-body';
import shortid from 'shortid';

import render from '../../utils/template-renderer.js';

import {isSecure, findPage} from './middlewares.js';

export default function(userDB){
  let router = new Router();

  router.get('/editor', isSecure, function *(next){

    this.body = yield render('editor', {});

  });


  router.get('/editor/:pageid', isSecure, findPage(userDB), function *(next){

    let pageObj = {
      pageid: this.req.pageObj.pageid,
      title: this.req.pageObj.title,
      sections: this.req.pageObj.sections,
      items: JSON.parse(this.req.pageObj.items)
    }

    this.body = yield render('editor', {pageContent: JSON.stringify(pageObj)});

  });



  router.get('/save/:pageid', isSecure, function *(next){
    let titleParam = this.params.pageid.replace("+", " ");

    userDB.get({username: this.req.user.username}).then((doc) => {
      let collection = doc['journalCollection'];
      let index = collection.findIndex((j) => j.title === titleParam);

      collection[index] = {
        title: titleParam,
        sections: ['aaa', 'bbb', 'nnn'],
        items: 'changed!'
      }
      doc.save();
    })
  })


  router.post('/save', isSecure, koaBody(), function *(next){
    console.log('saving page....');

    let data = this.request.body;
    //data = JSON.parse(data);

    let pageData = {
      title: data.title,
      pageid: data.pageid,
      sections: data.sections,
      items: JSON.stringify(data.items)
    }

    console.log(pageData);

    let doc = yield userDB.get({username: this.req.user.username});
    let collection = doc['journalCollection'];
    let index = collection.findIndex((j) => j.pageid === data.pageid);
    collection[index] = pageData;

    try{
      let res = yield doc.save();
      this.body = {status: true, error: null};
    } catch(err) {
      this.body = {status: false, error: err};
    }

  })



  router.post('/create', isSecure, koaBody(), function *(next){
    let data = this.request.body;

    let doc = yield userDB.get({username: this.req.user.username});

    let pageid = shortid.generate();

    let collection = doc['journalCollection'];

    collection.push({
      pageid: pageid,
      title: data.title,
      sections: ['title'],
      items: JSON.stringify({
        'title': {type:"text", content:"enter title", options: {align: "aligncenter"}}
      })
    })

    try{
      let res = yield doc.save();
      //this.redirect('/editor/' + pageid);
      this.body = {status: true, error: null, pageid: pageid};
    } catch(err) {
      this.body = {status: false, error: err, pageid: null};
    }
  })


  return router;
}
