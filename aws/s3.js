const request = require("request-promise");
const AwsClient = require("./config");
const S3 = new AwsClient.S3({});
module.exports = async (url) => {
  const fileName = url.split("/")[4];
  const folder = url.split("/")[3];
  const delparmas = {
    Key: `${folder}/${fileName}`,
    Bucket: "harshtagra",
  };
  const del = await S3.deleteObject(delparmas).promise();
};
module.exports.providertos3 = async (uri) => {
  const options = {
    uri: uri,
    encoding: null,
  };

  const body = await request(options);

  const uploadResult = await S3.upload({
    Bucket: "harshtagra",
    Key: `users_profile_picture/${Date.now()}`,
    Body: body,
  }).promise();

  return uploadResult.Location;
};
