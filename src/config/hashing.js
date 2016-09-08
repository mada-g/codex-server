import bcrypt from 'bcrypt-nodejs';

export function genHash(password){
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, null, null, (err, hash) => {
      if(err) reject(err);
      else resolve(hash);
    })
  })
}

export function validatePassword(pass, hashed){
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, hashed, (err, res) => {
      if(err) reject(err);
      else resolve(res);
    })
  })
}
