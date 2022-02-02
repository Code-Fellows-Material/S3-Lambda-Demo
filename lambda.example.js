exports.handler = async (event, context) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const image = decodeURIComponent(event.Records[0].s3.object);
  const imageJson = await S3.getObject({ Bucket, Key: "images.json" }).promise();

  const dataObj = JSON.parse(imageJson.Body.toString('ascii'));

  dataObj.images.push(Key.split('/')[1]);
  
  var fileName = 'images.json';
  var content = JSON.stringify(dataObj);
  var params = { Bucket, 'Key': fileName, 'Body': content };
  try {
      console.log('Adding file,')
      const data = await S3.putObject(params).promise();
      console.log("Successfully saved object to " + Bucket + "/" + fileName);
  } catch (err) {
       console.log(err)
  };
};
