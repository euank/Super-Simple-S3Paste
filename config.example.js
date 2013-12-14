module.exports = {
  siteBucket: {
    name: 'paste.esk.io',
    region: 'us-west-1'
  },
  rawBucket: {
    name: 'raw.paste.esk.io',
    region: 'us-east-1'
  },
  //The deploy credentials should have
  //full permissions on the site and raw buckets listed above.
  deployCredentials: {
    accessKeyId: 'xxxxxxxxxxxxxxxxxxxx',
    secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  //These credentials should have s3:GetObject and s3:PutObject on the rawBucket.
  //I'm not sure you actually need em with my permissions anyways
  pasteCredentials: {
    accessKeyId: 'AKIAJR2ZYLCFLYCY2CNA',
    secretAccessKey: '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'
  }
}

