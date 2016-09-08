import koa from 'koa';
import session from 'koa-generic-session';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';
import serve from 'koa-static';
import mount from 'koa-mount';
import cors from 'koa-cors';

import router from './routes/index.js';
import keys from '../utils/keys.js';

const app = koa();

app.keys = ['babous'];
app.use(session());
//app.use(bodyParser());
app.use(cors({origin: 'http://localhost:8080'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(mount('/assets', serve('public')));

app.use(router(passport).routes());

var port = process.env.PORT || 3000;

app.listen(port, ()=>{
  console.log(`Server running on port ${port}...`);
});
