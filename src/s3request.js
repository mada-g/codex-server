import aws from 'aws-sdk';
import shortid from 'shortid';

const S3_BUCKET = process.env.S3_BUCKET;

export function requestUpload(fileName, fileType, username){
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3();

    const id = username + "_" + shortid.generate();

    const s3Params = {
      Bucket: S3_BUCKET,
      Key: id,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    }

    s3.getSignedUrl('putObject', s3Params, (err, data)=>{
      if(err){
        reject(err);
      }
      else{
        resolve({id: id, signedRequest: data, url: `https://${S3_BUCKET}.s3.amazonaws.com/${id}`});
      }
    })
  })
}

export function deleteImg(fileName){
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3();

    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName
    }

    s3.deleteObject(s3Params, (err, data) => {
      if(err) reject({status: false});
      else resolve({status: true});
    })
  })
}

export function deleteAllImgs(imgsData){
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3();

    const s3Params = {
      Bucket: S3_BUCKET,
      Delete: {
        Objects: imgsData.map((img) => {
          return {Key: img.imgid};
        }),
        Quiet: true
      }
    }

    s3.deleteObjects(s3Params, (err, data) => {
      if(err) reject({status: false});
      else resolve({status: true});
    })
  })
}
