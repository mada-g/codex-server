import Router from 'koa-router';
import koaBody from 'koa-body';

import render from '../../utils/template-renderer.js';
import {requestUpload, deleteImg} from '../s3request.js';

import {isSecure} from './middlewares.js';

export default function(userDB){
  let router = new Router();

  router.post('/sign-s3', isSecure, koaBody(), function *(next){
    console.log("ok...")

    /*const fileName = this.request.query['file-name'];
    const fileType = this.request.query['file-type'];

    const pageid = this.request.query['pageid'];
*/
    let reqBody = this.request.body;

    const fileName = reqBody.filename;
    const fileType = reqBody.filetype;
    const dimen = reqBody.dimen;
    const pageid = reqBody.pageid;

    console.log('filename: ' + fileName);
    console.log('fileType: ' + fileType);
    console.log('dimensions:' + dimen);

    try{

      let data = yield requestUpload(fileName, fileType, this.req.user.username);
      let doc = yield userDB.getFields({username: this.req.user.username}, 'pageImgs');

      let pageImgs = doc['pageImgs'];
      if(!pageImgs) throw 'images not found';

      let thePage = pageImgs.find((p) => p.pageid === pageid);
      if(!thePage) throw "page not found";

      console.log(thePage);
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(thePage["imgsData"]);
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

      thePage["imgsData"].push({
        imgid: data.id,
        name: fileName,
        type: fileType,
        dimen: dimen,
        url: data.url,
        submit: 'ok',
        uploaded: false
      })

      yield doc.save();
      this.body = JSON.stringify(data);

      //this.body = {status: "ok"};

    } catch(e){

      console.log("Error!!!!!");
      this.body = null;
    }
  })

  router.get('/valid-upload', isSecure, function *(next){
    const imgid = this.request.query['imgid'];
    const pageid = this.request.query['pageid']

    console.log('validating upload...');
    console.log(imgid);
    console.log(pageid);

    try{

      let doc = yield userDB.getFields({username: this.req.user.username}, 'pageImgs');

      let pageImgs = doc['pageImgs'];
      if(!pageImgs) throw 'images not found';

      let thePage = pageImgs.find((p) => p.pageid === pageid);
      if(!thePage) throw "page not found";

      let theImage = thePage["imgsData"].find((p) => p.imgid === imgid);
      if(!theImage) throw "image not found";

      theImage.uploaded = true;

      yield doc.save();

      this.body = JSON.stringify({status: true, imgData: theImage});
    } catch(e){
      console.log(e);
      this.body = JSON.stringify({status: false, imgData: null});
    }
  })


  router.get('/delete-image', function *(next){
    const imgid = this.request.query['imgid'];
    const pageid = this.request.query['pageid']

    try{
      let res = yield deleteImg(imgid);

      if(!res.status) throw "could not reach s3";

      let doc = yield userDB.getFields({username: this.req.user.username}, 'pageImgs');

      let pageImgs = doc['pageImgs'];
      if(!pageImgs) throw 'images not found';

      let thePage = pageImgs.find((p) => p.pageid === pageid);
      if(!thePage) throw "page not found";

      let theImageIndex = thePage["imgsData"].findIndex((p) => p.imgid === imgid);
      if(!theImageIndex) throw "image not found";

      thePage["imgsData"].splice(theImageIndex, 1);

      yield doc.save();

      this.body = JSON.stringify({status: true});
    } catch(e){
      console.log(e);
      this.body = JSON.stringify({status: false});
    }

  })

  return router;
}
