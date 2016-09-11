
export let userFromURL = function *(next){
  this.req.userid = this.params.userid;
  yield next;
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
