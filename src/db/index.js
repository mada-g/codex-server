import mongoose from 'mongoose';

export function connect(url){

  mongoose.connect(url);
  console.log('connecting...');

  return new Promise((resolve, reject) => {
    let db = mongoose.connection;
    db.on('error', () => {reject('error')});
    db.once('open', () => {resolve('ok')});
  })
}


export class MongoConnect{
  constructor(model){
    this.model = model;
  }
  getModel = () => {
    return this.model;
  }

  findById = (id) => {
    return new Promise((resolve, reject) => {
      this.model.findById(id).then((res) => {
        resolve(res);
      }).catch((err) => {reject(err)});
    })
  }

  get = (query) => {
    return new Promise((resolve, reject) => {
      this.model.findOne(query).then((res) => {
        resolve(res);
      }).catch((error) => {reject(error)});
    })
  }

  getFields = (query, fields) => {
    return new Promise((resolve, reject) => {
      this.model.findOne(query, fields).then((res) => {
        resolve(res);
      }).catch((error) => {reject(error)});
    })
  }

  getAll = (query, selection) => {
    return new Promise((resolve, reject) => {
      this.model.find(query, selection).then((res) => {
        resolve(res);
      }).catch((error) => {reject(error)});
    })
  }

  update = (query, k, v) => {
    return new Promise((resolve, reject) => {
      this.get(query).then((doc) => {
        if(!doc) reject('error no doc');
        else{
          doc[k] = v;
          resolve(doc.save());
        }
      }).catch((err) => reject(err));
    })
  }

  save = (data) => {
    console.log("ready...");
    return new Promise((resolve, reject)=>{

      let doc = new this.model(data);
      doc.save((err, doc) => {
        if(err){
          console.log(err);
          reject(err);
        }
        else{
          console.log('SAVED!');
          resolve(doc);
        }
      })
    });
  }

}
