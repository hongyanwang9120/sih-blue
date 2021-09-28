const sharp = require('sharp');
const aws = require('aws-sdk');

exports.handler = async function (event) {
  console.log('request:', JSON.stringify(event, undefined, 2));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: 'Hi',
  };
};
