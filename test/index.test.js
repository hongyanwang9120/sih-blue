const sharp = require('sharp');
const { handler } = require('../src/index');

const EVENT = {
  resource: '/{proxy+}',
  path: '/100x100/.cat.jpeg',
  httpMethod: 'GET',
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip',
    Host: 'abcdefg.execute-api.us-west-2.amazonaws.com',
    'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'User-Agent': 'Amazon CloudFront',
    Via: '2.0 abcdefg.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'c4UIVrHhz-QYqFMGq_Q3E5VqX_1eTsDMmw9DHFtJIFNrsmujtX7lhA==',
    'X-Amzn-Trace-Id': 'Root=1-6151bfec-0cc439eb735894b31a71ac17',
    'X-Forwarded-For': '127.0.0.1, 127.0.0.1',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https',
  },
  multiValueHeaders: {
    Accept: [
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    ],
    'Accept-Encoding': ['gzip'],
    Host: ['abcdefg.execute-api.us-west-2.amazonaws.com'],
    'sec-ch-ua': [
      '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
    ],
    'sec-ch-ua-mobile': ['?0'],
    'sec-ch-ua-platform': ['"macOS"'],
    'sec-fetch-dest': ['document'],
    'sec-fetch-mode': ['navigate'],
    'sec-fetch-site': ['none'],
    'sec-fetch-user': ['?1'],
    'upgrade-insecure-requests': ['1'],
    'User-Agent': ['Amazon CloudFront'],
    Via: [
      '2.0 abcdefg.cloudfront.net (CloudFront)',
    ],
    'X-Amz-Cf-Id': ['c4UIVrHhz-QYqFMGq_Q3E5VqX_1eTsDMmw9DHFtJIFNrsmujtX7lhA=='],
    'X-Amzn-Trace-Id': ['Root=1-6151bfec-0cc439eb735894b31a71ac17'],
    'X-Forwarded-For': ['127.0.0.1, 127.0.0.1'],
    'X-Forwarded-Port': ['443'],
    'X-Forwarded-Proto': ['https'],
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: { proxy: '100x100/.cat.jpeg' },
  stageVariables: null,
  requestContext: {
    resourceId: '44t2gk',
    resourcePath: '/{proxy+}',
    httpMethod: 'GET',
    extendedRequestId: 'GUrtCHHOvHcFwKA=',
    requestTime: '27/Sep/2021:12:58:20 +0000',
    path: '/image/100x100/.cat.jpeg',
    accountId: '12345678',
    protocol: 'HTTP/1.1',
    stage: 'image',
    domainPrefix: 'abcdefg',
    requestTimeEpoch: 1632747500879,
    requestId: 'ef2bdcea-88db-4c28-a3d6-c4e43bc64cbb',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '127.0.0.1',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'Amazon CloudFront',
      user: null,
    },
    domainName: 'abcdefg.execute-api.us-west-2.amazonaws.com',
    apiId: 'abcdefg',
  },
  body: null,
  isBase64Encoded: false,
};

it('/gogopher.jpg', async () => {
  const p = '/gogopher.jpg';
  EVENT.path = p;
  EVENT.requestContext.path = p;

  const o = await handler(EVENT);
  expect(o.statusCode).toBe(400);
  expect(o.body).toBe('{"message":"Can NOT match rules"}');
});

it('/userfiles/009/334/225/85338!Background.jpg', async () => {
  const p = '/userfiles/009/334/225/85338!Background.jpg';
  EVENT.path = p;
  EVENT.requestContext.path = p;

  const o = await handler(EVENT);
  expect(o.statusCode).toBe(200);
  expect(o.isBase64Encoded).toBeTruthy();
  expect(o.headers['Content-Type']).toBe('jpeg');

  const metadata = await sharp(Buffer.from(o.body, 'base64')).metadata();

  expect(metadata.format).toBe('jpeg');
  expect(metadata.width).toBe(480);
  expect(metadata.height).toBe(320);
});

it('/userfiles/000/000/002/17!Head.png!m.png?imageInfo', async () => {
  const p = '/userfiles/000/000/002/17!Head.png!m.png?imageInfo';
  EVENT.path = p;
  EVENT.requestContext.path = p;

  const o = await handler(EVENT);
  expect(o.statusCode).toBe(200);

  const body = JSON.parse(o.body);
  expect(body).toEqual({
    colorModel: 'srgb',
    format: 'jpeg',
    height: 320,
    size: 23289,
    width: 480,
  });
});
