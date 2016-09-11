import localpassport from 'passport-local';

import {genHash, validatePassword} from './hashing.js';



let mockJournals = [
    {
      title: "my life",
      sections: ['sfiojfsd', 'dkwa90d2q39', 'yudasiu'],
      items: "isdfioifepojofe"
    },
    {
      title: "babous",
      sections: ['wae21ojfsd', 'mkldd2q39', 'xsazsu'],
      items: "kdjoapd000e"
    },
    {
      title: "duckyduck",
      sections: ["sdd", 'ewqd2q39', 'asiu'],
      items: "eeqwew"
    }
]



let LocalStrategy = localpassport.Strategy;

export function passportConfig(passport){
  return (userDB) => {

    console.log('config passport...');

    passport.serializeUser((user, done) => {
      console.log('serializing user...');
      done(null, user.id);
      console.log('DONE!')
    });

    passport.deserializeUser((id, done) => {
      console.log('deserializing user...');
      userDB.getModel().findById(id, done);
      console.log('DONE!')
    });


    // SIGN-UP

    passport.use('local-signup', new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, username, password, done) => {
        console.log('authenticating...');
        userDB.get({"username": username}).then((user) => {
          console.log('connection ok');
          if(user) return done(null, false, {message: "username is already taken."});
          else{
            console.log('username not taken');

            genHash(password)
                   .then((hash) => {
                     return userDB.save({ username, password: hash , journalCollection: [], pageImgs: [] })
                   })
                   .then((newUser) => {console.log('saving user!'); return done(null, newUser)})
                   .catch((err) => {console.log(err); return done(err)});
          }

        }).catch((err) => {done(err)});
      }
    ))

    //LOGIN

    passport.use('local-login', new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, username, password, done) => {
        userDB.getFields({"username": username}, 'username password').then((user) => {
          if(!user) return done(null, false, {message: "username invalid"});

          else{
            validatePassword(password, user.password).then((res) => {
              if(res) return done(null, user);
              else return done(null, false, {message: "wrong password"});
            }).catch(done);
          }
        }).catch(done);
      }
    ))

  }
}
