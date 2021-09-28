const fs = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');

class S3Store {
  constructor(bucket, region) {
    this._bucket = bucket;
    this._s3 = new S3({ region });
  }

  async get(key) {
    const res = await this._s3.getObject({
      Bucket: this._bucket,
      Key: key,
    }).promise();
    return res;
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
