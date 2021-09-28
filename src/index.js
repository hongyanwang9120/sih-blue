const rules = require('./rules');

exports.handler = async function (event) {
  console.log('request:', JSON.stringify(event, undefined, 2));

  try {
    const processFunc = rules.find(event.path);
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
  } catch (e) {
    if (e.statusCode) {
      return {
        statusCode: e.statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e),
      };
    }
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal error' }),
    };
  }
};
