import Router from 'koa-router';
import shortid from 'shortid';
import parse from 'co-body';
import koaBody from 'koa-body';

import render from '../../utils/template-renderer.js';
import {requestUpload} from '../s3request.js';
import mongo from '../mongo.js';
import keys from '../../keys.js';

import {connect, MongoConnect} from '../db/index.js';
import {passportConfig} from '../config/passport.js';

import {isSecure} from './middlewares.js';

import Editor from './editor.js';
import PublicRoutes from './public-routes.js';
import Authentication from './authentication.js';
import ImgUpload from './img-upload.js';

import userDB from '../models/user.js';

export default function(passport){

  let router = new Router();

  console.log('connecting to db...');
  connect(keys.mongoUsers).then(() => passportConfig(passport)(new MongoConnect(userDB)));

  let editor = Editor(new MongoConnect(userDB));
  let publicRoutes = PublicRoutes(new MongoConnect(userDB));
  let authentication = Authentication(passport);
  let imgUpload = ImgUpload(new MongoConnect(userDB));

  router.use(publicRoutes.routes(), publicRoutes.allowedMethods());
  router.use(authentication.routes(), authentication.allowedMethods());
  router.use(editor.routes(), editor.allowedMethods());
  router.use(imgUpload.routes(), imgUpload.allowedMethods());

  router.post('/memo', koaBody(), function *(next){
    this.body = {status: 'okok'};
  })

  return router;
}
