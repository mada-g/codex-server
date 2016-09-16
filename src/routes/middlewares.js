
export let userFromURL = function *(next){
  this.req.userid = this.params.userid;
  yield next;
}


export function retrievePage(userDB){
  return function *(next){
    try{
      let pageid = this.params.pageid || this.request.body.pageid;
      if(!pageid) throw 'page not found!';

      console.log('retrieving: ' + pageid+"...");

      let doc = yield userDB.getFields({username: this.req.userid, "journalCollection.pageid": pageid}, {"journalCollection.$": 1});
      this.req.pageObj = doc['journalCollection'][0];
      this.req.dbDoc = doc;

      console.log('retieved!');

    } catch(err) {
      console.log(err);
      this.req.pageObj = null;
    }

    yield next;
  }
}



export function findPage(userDB){
  return function *(next){
    let pageid = this.params.pageid.replace("+", " ");

    console.log("Fetching Page...");

    let doc = yield userDB.get({username: this.req.userid});
    this.req.pageObj = doc['journalCollection'].find((j) => j.pageid === pageid);

    console.log("Found!");

    yield next;
  }
}


export let isSecure = function *(next){
  if(!this.isAuthenticated()){
    this.redirect('/login');
  } else {
    this.req.userid = this.req.user.username;
    yield next;
  }
}


export let isAuthorized = function *(next){
  if(!this.isAuthenticated()){
    this.redirect('/signup');
  }
  else{
    if(this.params['usid'] === this.req.user.username) yield next;
    else this.redirect('/login');
  }
}
