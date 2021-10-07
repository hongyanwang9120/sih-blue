const path = require('path');
const sharp = require('sharp');
const { ImageMogr2 } = require('../src/image-mogr2');
const { LocalStore } = require('../src/store');

const store = new LocalStore(path.join(__dirname, './fixtures'));

it('thumbnail/100x', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  await im2.thumbnail('100x').process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(100);
  expect(info.height).toBe(67);
});

it('thumbnail/!20p', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  await im2.thumbnail('!20p').process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(128);
  expect(info.height).toBe(85);
});

it('thumbnail/100x100', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  await im2.thumbnail('100x100').process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(100);
  expect(info.height).toBe(67);
});

it('thumbnail/100x50', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  await im2.thumbnail('100x50').process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(75);
  expect(info.height).toBe(50);
});

it('thumbnail/!100x100r', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  await im2.thumbnail('!100x100r').process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(150);
  expect(info.height).toBe(100);
});

it('thumbnail/!100x100r', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  await im2.thumbnail('!100x100r').process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(150);
  expect(info.height).toBe(100);
});

it('thumbnail/!100x50r', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  await im2.thumbnail('!100x50r').process();

  const { info } = await image.toBuffer({ resolveWithObject: true });

  expect(info.width).toBe(100);
  expect(info.height).toBe(67);
});

it('thumbnail/invalid', async () => {
  const image = sharp(await store.get('gogopher.jpg'));
  const im2 = new ImageMogr2(image);
  const fn = () => im2.thumbnail('invalid');

  expect(fn).toThrowError(/Invalid thumbnail query/);
});
