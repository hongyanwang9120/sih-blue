const fs = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');

class S3Store {
  constructor(bucket) {
    this._bucket = bucket;
    this._s3 = new S3();
  }

  async get(key) {
    console.log(`S3Store request s3://${this._bucket}/${key}`);
    const res = await this._s3.getObject({
      Bucket: this._bucket,
      Key: key,
    }).promise();
    return res.Body;
  }
}

class LocalStore {
  constructor(root) {
    this._root = root;
  }

  async get(p) {
    return fs.promises.readFile(path.join(this._root, p));
  }
}

exports.S3Store = S3Store;
exports.LocalStore = LocalStore;
