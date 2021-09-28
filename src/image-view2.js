const sharp = require('sharp');
const createError = require('http-errors');

const JPG = 'jpg';
const JPEG = sharp.format.jpeg.id;

class ImageView2 {
  constructor(image) {
    if (!image) {
      throw createError(500, 'Empty image');
    }
    if (!(image instanceof sharp)) {
      throw createError(500, 'Image must be a sharp object');
    }
    this._image = image;
    this._m = 0;
    this._w = 0;
    this._h = 0;
    this._q = 75;
  }

  /**
   * Mode
   * @param {*} v
   * @returns this
   */
  m(v) {
    if (!(v === 0 || v === 1 || v === 2 || v === 3 || v === 4 || v === 5)) {
      throw createError(400, 'Invalid mode');
    }
    this._m = v;
    return this;
  }

  /**
   * Width
   * @param {*} v
   * @returns this
   */
  w(v) {
    this._w = v;
    return this;
  }

  /**
   * Height
   * @param {*} v
   * @returns this
   */
  h(v) {
    this._h = v;
    return this;
  }

  /**
   * Quality
   * @param {*} v
   * @returns this
   */
  q(v) {
    this._q = v;
    return this;
  }

  async process() {
    const image = this._image;
    const metadata = await image.metadata();

    if (this._w || this._h) {
      const opts = {};
      if (this._m === 0) {
        opts.fit = sharp.fit.inside;
      } else if (this._m === 1) {
        opts.fit = sharp.fit.cover;
      } else if (this._m === 2) {
        opts.fit = sharp.fit.inside;
      }

      image.resize(this._w, this._h, opts);
    }

    if (this._q && (JPEG === metadata.format || JPG === metadata.format)) {
      image.jpeg({ quality: this._q });
    }

    return image;
  }
}

exports.ImageView2 = ImageView2;
