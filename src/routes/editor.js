import Router from 'koa-router';
import koaBody from 'koa-body';
import shortid from 'shortid';

import render from '../../utils/template-renderer.js';

import {isSecure, findPage, retrievePage} from './middlewares.js';

export default function(userDB){
  let router = new Router();


  router.get('/editor', isSecure, function *(next){
    try{
      let doc = yield userDB.getFields({username: this.req.user.username}, {
        "journalCollection.title": 1,
        "journalCollection.pageid": 1,
        "journalCollection.published": 1
      });

      if(!doc || !doc['journalCollection']){
        throw 'user data not found.';
      }

      let drafts = [], published = [];

      doc['journalCollection'].forEach((p) => {
        if(p.published) published.push({pageid: p.pageid, title: p.title, details: "ok ok ok"});
        else drafts.push({pageid: p.pageid, title: p.title, details: "ok ok ok"});
      })


      this.body = yield render('home', {userData: JSON.stringify(
          {
            username: this.req.user.username,
            drafts: drafts,
            published: published
          }
        )}
      );

    } catch(err) {
      console.log(err);
      this.body = {status: false, error: err}
    }

  })


  router.get('/editor/:pageid', isSecure, function *(next){
    try{
      let doc = yield userDB.getFields({username: this.req.user.username, "journalCollection.pageid": this.params.pageid}, {"journalCollection.$": 1});

      let pageData = doc['journalCollection'][0];

      let pageObj = {
        pageid: pageData.pageid,
        title: pageData.title,
        sections: pageData.sections,
        items: JSON.parse(pageData.items),
        published: pageData.published,
        headings: pageData.headings,
        headingNumbering: pageData.headingNumbering,
        imgsData: []
      }

      this.body = yield render('editor', {pageContent: JSON.stringify(pageObj)});

    } catch (err) {
      console.log(err);
      this.body = err;
    }

  });


  router.get('/pageimgs', isSecure, function *(next){
    const pageid = this.request.query['pageid'];

    try{
      let doc = yield userDB.getFields({username: this.req.user.username}, 'pageImgs');

      let pageImgs = doc['pageImgs'];
      if(!pageImgs) throw 'images not found';

      let thePage = pageImgs.find((p) => p.pageid === pageid);
      if(!thePage) throw "page not found";

      this.body = {status:true, imgsData: thePage['imgsData']}
    } catch(e) {
      console.log(e);
      this.body = {status: false, imgsData: null}
    }

  })

  router.post('/save', isSecure, koaBody(), function *(next){
    let data = this.request.body;

    try{
      let pageData = {
        title: data.title,
        pageid: data.pageid,
        sections: data.sections,
        items: JSON.stringify(data.items),
        published: data.published,
        headings: data.headings,
        headingNumbering: data.headingNumbering
      }

      let doc = yield userDB.getModel().update({username: this.req.userid, "journalCollection.pageid": data.pageid}, {
        $set: {"journalCollection.$": pageData}
      })

      let res = yield doc.save();
      this.body = {status: true, error: null};

    } catch(err) {
      this.body = {status: false, error: err};
    }

  })


  router.post('/create', isSecure, koaBody(), function *(next){

    try{
      let data = this.request.body;
      let pageid = shortid.generate();

      let newPage = {
        pageid: pageid,
        title: data.title,
        published: false,
        sections: ['title'],
        items: JSON.stringify({
          'title': {type:"text", content:"New Page", options: {align: "aligncenter"}}
        })
      }

      let newPageInfo = {pageid: pageid, title: "New Page", details: "September 20 1992"}

      let pageImgs = {pageid: pageid, imgsData: []}

      let doc = yield userDB.getModel().update({username: this.req.userid}, { $push: {
        "journalCollection": newPage,
        "drafts": newPageInfo,
        "pageImgs": pageImgs
      }});

      this.body = {status: true, error: null, pageid: pageid};

    } catch(err) {
      console.log(err);
      this.body = {status: false, error: err, pageid: null};
    }
  })


  return router;
}
