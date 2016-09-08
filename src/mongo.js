import mongoose from 'mongoose';


export default class MongoConnection{
  constructor(uri){
    this.uri = uri;
    this.db = null;
    this.model = null;
  }

  connect = () => {
    mongoose.connect(this.uri);
    console.log('connecting...');
    return new Promise((resolve, reject) => {
      this.db = mongoose.connection;
      this.db.on('error', () => {reject('error')});
      this.db.once('open', () => {resolve('ok')});
    })
  }

  defineModel = (name, _schema) => {
    const schema = mongoose.Schema(_schema);
    this.model = mongoose.model(name, schema);
    console.log("success...");
  }

  getAlt = (query) => {
    return this.model.findOne(query);
  }

  get = (query) => {
    return new Promise((resolve, reject) => {
      this.model.findOne(query).then((res) => {
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
          resolve('ok');
        }
      })
    });

  }

}
