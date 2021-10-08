const sharp = require('sharp');
const createError = require('http-errors');

const JPG = 'jpg';
const JPEG = sharp.format.jpeg.id;

class ImageMogr2 {
  constructor(image) {
    if (!image) {
      throw createError(500, 'Empty image');
    }
    if (!(image instanceof sharp)) {
      throw createError(500, 'Image must be a sharp object');
    }
    this._image = image;
    this._w = 0;
    this._h = 0;
    this._b = false;
    this._q = 75;
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

  /**
   * Blur
   * @param {*} v
   * @returns this
   */
  b(v) {
    this._b = v;
    return this;
  }

  async process() {
    const image = this._image;
    const metadata = await image.metadata();
    if (this._w || this._h) {
      image.resize(this._w, this._h);
    }
    if (this._q && (JPEG === metadata.format || JPG === metadata.format)) {
      image.jpeg({ quality: this._q });
    }
    if (this._b && (JPEG === metadata.format || JPG === metadata.format)) {
      image.blur(50*50);
    }

    return image;
  }
}

exports.ImageMogr2 = ImageMogr2;
