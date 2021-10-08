const rules = require('./rules');

function errorResp(code, obj) {
  return {
    statusCode: code,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  };
}

exports.handler = async function (event) {
  console.log('request:', JSON.stringify(event, undefined, 2));

  try {
    const processFunc = rules.find(event.path || event.rawPath);
    if (processFunc) {
      const { data, info, isBase64Encoded } = await processFunc();
      return {
        isBase64Encoded,
        statusCode: 200,
        headers: { 'Content-Type': info.format },
        body: data,
      };
    }
    return errorResp(400, { message: 'Can NOT match rules' });
  } catch (e) {
    console.error(e);
    if (e.statusCode) {
      return errorResp(e.statusCode, e);
    }
    return errorResp(500, { message: 'Internal error' });
  }
};
