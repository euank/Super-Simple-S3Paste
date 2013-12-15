if(typeof AWS === 'undefined') {
  //noscript blocking amazonaws but not us
  var ns = document.getElementById("noscript");
  ns.outerHTML = ns.outerHTML.replace(/noscript/g, 'div');
}
AWS.config.update(awsCredentials);
var bucket = rawBucket;
// can't use an alias like raw.paste.esk.io because ?versionId doesn't work then
var baseRawUrl = "https://s3.amazonaws.com/"+bucket+"/";
var PASTEID_LENGTH = 10;

var s3 = new AWS.S3();

var txt = document.getElementById('paste');
var errNode = document.getElementById('err');
var successNode = document.getElementById('success');
var pid = document.getElementById('pid');
if(pid.value === '') {
  getUnusedId(function(id) {
    pid.value = id;
  });
} else {
  checkIfIdExists(pid.value, function(exists) {
    if(exists) {
      getUnusedId(function(id) {
        pid.value = id;
      });
    }
  });
}

document.getElementById('upload').onclick = function() {
  var pasteId = pid.value;

  checkIfIdExists(pasteId, function(exists) {
    errNode.innerHTML = '';
    if(exists) {
      errNode.innerHTML = "This paste id already exists. Please try another";
      return;
    }
    s3.putObject({Bucket: bucket, Key: pasteId, Body: txt.value, ContentType: 'text/plain'}, function(err, res) {
      if(err) {
        errNode.innerHTML = "Error uploading paste. Send help please. " + err;
        return;
      }
      var url = baseRawUrl + encodeURIComponent(pasteId) + "?versionId=" + encodeURIComponent(res.VersionId);
      successNode.innerHTML = "Paste uploaded!<br />" +
                              'Redirecting you to its page <a href="'+url+'">here</a>';
      window.location = url;

    });
  });

};

function generateRandomId() {
  //Use characters that are valid in s3 bucket names
  //and don't have to be url-encoded
  var validUrlChars = 'abcdefghijklmnopqrstuvwxyz';
  validUrlChars += validUrlChars.toUpperCase();
  validUrlChars += '/-~._0123456789';
  var ret = '';
  for(var i=0;i<PASTEID_LENGTH;i++) {
    ret+= validUrlChars[Math.floor(Math.random() * validUrlChars.length)];
  }
  return ret;
}

function checkIfIdExists(id, cb) {
  s3.headObject({Bucket: bucket, Key: id}, function(err, data) {
    if(err) {
      return cb(false);
    } else {
      return cb(true);
    }
  });
}

function getUnusedId(callback) {
  var id = generateRandomId();
  checkIfIdExists(id, function(exists) {
    if(exists) {
      return getUnusedId(callback);
    } else {
      callback(id);
    }
  });
}
