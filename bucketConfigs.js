var config = require("./config");

var siteBucket = config.siteBucket.name;
var rawBucket = config.rawBucket.name;

exports.siteBucketPolicy = {
  "Version": "2008-10-17",
  "Id": "Policy1386635324623",
  "Statement": [{
    "Sid": "Stmt1386635078179",
    "Effect": "Allow",
    "Principal": {
      "AWS": "*"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::" + siteBucket + "/*"
  }]
};
exports.rawBucketPolicy = {
  "Version": "2008-10-17",
  "Id": "Policy1386635324623",
  "Statement": [{
    "Sid": "Stmt1386635078179",
    "Effect": "Allow",
    "Principal": {
      "AWS": "*"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::" + rawBucket + "/*"
  },{
    "Sid": "Stmt1386635199132",
    "Effect": "Allow",
    "Principal": {
      "AWS": "*"
    },
    "Action": "s3:PutObject",
    "Resource": "arn:aws:s3:::" + rawBucket + "/*"
  },{
    "Sid": "Stmt1386635315324",
    "Effect": "Deny",
    "Principal": {
      "AWS": "*"
    },
    "Action": "s3:PutObject",
    "Resource": "arn:aws:s3:::" + rawBucket + "/index.html"
  },{
    "Sid": "Stmt1386635315325",
    "Effect": "Deny",
    "Principal": {
      "AWS": "*"
    },
    "Action": "s3:PutObject",
    "Resource": "arn:aws:s3:::" + rawBucket + "/404.html"
  },{
    "Sid": "Stmt1386636860786",
    "Effect": "Allow",
    "Principal": {
      "AWS": "*"
    },
    "Action": "s3:GetObjectVersion",
    "Resource": "arn:aws:s3:::" + rawBucket + "/*"
  }]
};

exports.rawBucketCors = {
  AllowedHeaders: ['*'],
  AllowedMethods: ['GET', 'PUT', 'HEAD'],
  AllowedOrigins: ['*'],
  ExposeHeaders: ['x-amz-version-id'],
  MaxAgeSeconds: 86400
};
