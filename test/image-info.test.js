const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { ImageInfo } = require('../src/image-info');

const GOGOPHER = fs.readFileSync(path.join(__dirname, './fixtures/gogopher.jpg'));

it('imageInfo', async () => {
  const image = sharp(GOGOPHER);
  const ii = new ImageInfo(image);
  const info = await ii.process();

  expect(info).toEqual({
    size: 214513,
    format: 'jpeg',
    width: 640,
    height: 427,
    colorModel: 'srgb',
    orientation: 1,
  });
});
