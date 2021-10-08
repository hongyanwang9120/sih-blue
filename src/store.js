const fs = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');

class S3Store {
  constructor(bucket) {
    this._bucket = bucket;
    this._s3 = new S3();
  }

  async get(key) {
    console.log(`${S3Store.name} get s3://${this._bucket}/${key}`);
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
    const filename = path.join(this._root, p);
    console.log(`${LocalStore.name} get file://${filename}`);
    return fs.promises.readFile(filename);
  }
}

exports.S3Store = S3Store;
exports.LocalStore = LocalStore;
exports.createStore = function () {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    const p = path.join(__dirname, '../test/fixtures');
    console.log(`using ${LocalStore.name} file://${p}`);
    return new LocalStore(p);
  }

  const bucket = (process.env.SOURCE_BUCKETS || '').split(',')[0];
  console.log(`using ${S3Store.name} s3://${bucket}`);
  return new S3Store(bucket);
};
