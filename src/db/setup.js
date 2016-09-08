import mongo from './mongo.js';
import User from '../models/user.js';

export function setup(url){

  return new Promise((resolve, reject) => {
    let mDB = new mongo(url);
    console.log('connecting...');

    mDB.connect()
       .then(() => {
         console.log('connected!')
         mDB.defineModel('User', User);
         resolve(mDB);
       })
       .catch((err) => {reject(err)});
  })
}
