var jade = require('jade');
var AWS = require('aws-sdk');
var fs = require('fs');
var config = require('./config');
var bucketConfigs = require("./bucketConfigs");
var async = require('async');

AWS.config.update(config.deployCredentials);
var raws3 = new AWS.S3({region: config.rawBucket.region});
var sites3 = new AWS.S3({region: config.siteBucket.region});

var siteBucket = config.siteBucket.name;
var rawBucket = config.rawBucket.name;

var jadePageVars = {
  awsCredentials: config.pasteCredentials,
  rawBucket: rawBucket
};


function getContentType(file) {
  //todo, improve this. For now, hardcode the ones we need.
  if(/\.html/.test(file)) return "text/html; charset=utf-8";
  if(/\.js/.test(file)) return "application/javascript";
}

function uploadSiteFile(file, cb) {
  if(/\.jade$/.test(file)) {
    jade.renderFile(file, jadePageVars, function(err, html) {
      if(err) return cb(err);
      sites3.putObject({
        Bucket: siteBucket,
        Key: file.replace(/\.jade$/, '.html'),
        Body: html,
        ContentType: 'text/html; charset=utf-8'
      }, cb);
    });
  } else {
    fs.readFile(file, function(err, data) {
      sites3.putObject({
        Bucket: siteBucket,
        Key: file,
        Body: data,
        ContentType: getContentType(file)
      },cb);

    });
  }
}

function uploadSiteFiles(cb) {
  async.parallel([
    function(pcb){
      uploadSiteFile('paste.jade', pcb);
    },
    function(pcb) {
      uploadSiteFile('paste.js', pcb);
    },
    function(pcb) {
      uploadSiteFile('404.jade', pcb);
    }
  ], cb);
}

function setSiteConfiguration(cb) {
  async.parallel([
    function(pcb) {
      sites3.putBucketWebsite({
        Bucket: siteBucket,
        WebsiteConfiguration: {
          ErrorDocument: {Key: '404.html'},
          IndexDocument: {Suffix: 'paste.html'}
        }
      },pcb);
    },
    function(pcb) {
      sites3.putBucketPolicy({
        Bucket: siteBucket,
        Policy: JSON.stringify(bucketConfigs.siteBucketPolicy)
      },pcb);
    }
  ], cb);
}
function setRawConfiguration(cb) {
  async.series([
    function(pcb) {
      raws3.putBucketWebsite({
        Bucket: rawBucket,
        WebsiteConfiguration: {
          ErrorDocument: {Key: '404.html'},
          IndexDocument: {Suffix: 'index.html'}
        }
      },pcb);
    },
    function(pcb) {
      // I have no clue why, but this doesn't work.
      // Manually enable versioning for the raw bucket.
      raws3.putBucketVersioning({
        Bucket: rawBucket,
        VersioningConfiguration: {
          Status: 'Enabled'
        }
      }, pcb);
    },
    function(pcb) {
      console.log(rawBucket);
      raws3.putBucketPolicy({
        Bucket: rawBucket,
        Policy: JSON.stringify(bucketConfigs.rawBucketPolicy)
      },pcb);
    },
    function(pcb) {
      raws3.putBucketCors({
        Bucket: rawBucket,
        CORSConfiguration: {
          CORSRules: [bucketConfigs.rawBucketCors]
        }
      }, pcb);
    }
  ], cb);
}

if(/upgrade|update|upload/.test(process.argv[2])) {
  uploadSiteFiles(function(err, results) {
    if(err) console.log(err);
    else console.log("Uploaded files!");
  });
} else {
  async.series([
    setSiteConfiguration,
    setRawConfiguration,
    uploadSiteFiles
  ], function(err, results) {
    if(err) console.log(err);
    else console.log("Deployed site");
  });
}
