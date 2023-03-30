const AWS = require("aws-sdk");
const accessKeyId = "AKIAZ6DA3N2ZXMWTR6FX";
const secretAccessKey = "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";
const region = "ap-south-1";

AWS.config.update({ region, credentials: { accessKeyId, secretAccessKey } });
module.exports = AWS;
