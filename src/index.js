const rules = require('./rules');

exports.handler = async function (event) {
  console.log('request:', JSON.stringify(event, undefined, 2));
  let myEvent = JSON.parse(JSON.stringify(event))

const processFunc = rules.find(myEvent.rawPath);  //bluedsy
  // const processFunc = rules.find(event.path);  //blued
  if (processFunc) {
    const { data, info } = await processFunc();
    return {
      isBase64Encoded: true,
      statusCode: 200,
      headers: { 'Content-Type': info.format },
      body: data.toString('base64'),
    };
  }
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Can NOT match rules' }),
  };
};
