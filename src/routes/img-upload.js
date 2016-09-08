import Router from 'koa-router';

import render from '../../utils/template-renderer.js';
import {requestUpload} from '../s3request.js';

export default function(mDB){
  let router = new Router();

  router.get('/save', function *(next){
    console.log("ok...")

    yield mDB.save({
      uploaded: false,
      imgid: "a7a8",
      name: 'babous',
      type: 'jpg',
      submit: 'ok',
      url: 'madalin.ski/test.jpg'
    })

    this.body = 'ok!';

  })

  router.get('/sign-s3', function *(next){
    console.log("ok...")

    const fileName = this.request.query['file-name'];
    const fileType = this.request.query['file-type'];

    console.log('filename: ' + fileName);
    console.log('fileType: ' + fileType);

    try{

      let data = yield requestUpload(fileName, fileType);
      yield mDB.save({
        imgid: data.id,
        name: fileName,
        type: fileType,
        url: data.url,
        submit: 'ok',
        uploaded: false
      });
      this.body = JSON.stringify(data);

    } catch(e){
      console.log(e);
      this.body = null;
    }
  })

  router.get('/valid-upload', function *(next){
    const id = this.request.query['imgid'];

    try{
      let doc = yield mDB.update({imgid: id}, "uploaded", true);
      this.body = JSON.stringify({status: 'ok'});
    } catch(e){
      console.log(e);
      this.body = JSON.stringify({status: 'error'});
    }
  })

  return router;
}
