const path = require('path');
const sharp = require('sharp');
const { ImageInfo } = require('../src/image-info');
const { LocalStore } = require('../src/store');

const store = new LocalStore(path.join(__dirname, './fixtures'));

it('imageInfo', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
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
