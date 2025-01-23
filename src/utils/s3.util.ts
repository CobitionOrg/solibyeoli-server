const aws = require('aws-sdk');
const crypto1 = require('crypto');
const { promisify } = require('util')
const randomBytes = promisify(crypto1.randomBytes)


const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4"
})

export async function generateUploadURL() {
  const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4"
  })

  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)

  // console.log('---------------------');
  // console.log(uploadURL);
  return { uploadURL, imageName };
}


export async function deleteUploadObject(name: string){
  const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4"
  });

  //const rawBytes = await randomBytes(16);
  //const imageName = rawBytes.toString('hex');

  await s3.deleteObject({
    Bucket: bucketName,
    Key: name
  },async (err:any, data:any) => {
    if(err){
      console.error(err);
      return {success:false};
    }else{
      return {success:true};
    }
  })
}
