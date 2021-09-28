const path = require('path');
const sharp = require('sharp');
const { ImageView2 } = require('../src/image-view2');
const { LocalStore } = require('../src/store');

const store = new LocalStore(path.join(__dirname, './fixtures'));

it('image-view2 resize basic', async () => {
  const image = sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: 'gray',
    },
  });
  const iv2 = new ImageView2(image);
  await iv2
    .w(25)
    .h(50)
    .process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(25);
  expect(info.height).toBe(25);
});

it('imageView2/1/w/100/h/100', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const iv2 = new ImageView2(image);
  await iv2
    .m(1)
    .w(100)
    .h(100)
    .process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(100);
  expect(info.height).toBe(100);
});
