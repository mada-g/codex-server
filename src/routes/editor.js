import Router from 'koa-router';
import koaBody from 'koa-body';
import shortid from 'shortid';

import render from '../../utils/template-renderer.js';

import {isSecure, findPage} from './middlewares.js';

export default function(userDB){
  let router = new Router();

  router.get('/editor', isSecure, function *(next){

    try{
      let doc = yield userDB.getFields({username: this.req.user.username}, 'drafts published');

      console.log(doc['drafts']);

      console.log(doc['published']);

      let userObj = {
        username: this.req.user.username,
        drafts: doc['drafts'],
        published: doc['published']
      }

      this.body = yield render('home', {userData: JSON.stringify(userObj)});
    } catch(err) {
      console.log(err);
      this.body = {status: false, error: err}
    }


  });


  router.get('/editor/:pageid', isSecure, findPage(userDB), function *(next){

    let pageObj = {
      pageid: this.req.pageObj.pageid,
      title: this.req.pageObj.title,
      sections: this.req.pageObj.sections,
      items: JSON.parse(this.req.pageObj.items),
      published: this.req.pageObj.published,
      headings: this.req.pageObj.headings,
      headingNumbering: this.req.pageObj.headingNumbering,
      imgsData: []
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
    console.log('saving page....');

    let data = this.request.body;
    //data = JSON.parse(data);


    let doc = yield userDB.get({username: this.req.user.username});
    let collection = doc['journalCollection'];
    let index = collection.findIndex((j) => j.pageid === data.pageid);

    let info = null;

    if(collection[index]['published']){
      info = doc['published'];
    } else {
      info = doc['drafts'];
    }

    let theInfo = info.find((i) => i.pageid === data.pageid);

    theInfo.title = data.title;

    let pageData = {
      title: data.title,
      pageid: data.pageid,
      sections: data.sections,
      items: JSON.stringify(data.items),
      published: collection[index]['published'],
      headings: data.headings,
      headingNumbering: data.headingNumbering
    }

    console.log(pageData);

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
    let pageid = shortid.generate();

    let doc = yield userDB.get({username: this.req.user.username});
    let collection = doc['journalCollection'];
    let pageImgs = doc['pageImgs'];
    let drafts = doc['drafts'];

    collection.push({
      pageid: pageid,
      title: data.title,
      published: false,
      sections: ['title'],
      items: JSON.stringify({
        'title': {type:"text", content:"New Page", options: {align: "aligncenter"}}
      })
    })

    pageImgs.push({
      pageid: pageid,
      imgsData: []
    })

    drafts.push({pageid: pageid, title: "New Page", details: "September 20 2016"});

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
