/* eslint-disable no-bitwise */
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
    this._b = false;
    this._colorspace = false;
    this._q = 75;
    this._thumbnail = async () => {};
    this._crop = async () => {};
  }

  /**
   * Quality
   * @param {*} v
   * @returns this
   */
  q(v) {
    if (Number.isNaN(v)) throw createError(400, 'Invalid input');
    this._q = v;
    return this;
  }

  /**
   * Blur
   * @param {*} v
   * @returns this
   */
  b(v) {
    if (v) {
      this._b = v;
    }
    return this;
  }

  /**
   * Colorspace
   * @param {*} v
   * @returns this
   */

  colorspace(v) {
    if (v) {
      this._colorspace = v;
    }
    return this;
  }

  /**
   * https://developer.qiniu.com/dora/8255/the-zoom
   * @param {String} v
   * @returns this
   */
  thumbnail(v) {
    const rules = [
      {
        pattern: /^(\d+)x$/m, // thumbnail/100x
        proc: async (m) => {
          const w = Number.parseInt(m[1], 10);
          if (Number.isNaN(w) || w <= 0) {
            throw createError(400, 'Invalid /thumbnail/<Width>x');
          }
          this._image.resize(w);
        },
      },
      {
        pattern: /^!(\d+)p$/m, // thumbnail/!10p
        proc: async (m) => {
          const percent = Number.parseInt(m[1], 10);
          if (Number.isNaN(percent) || percent <= 0) {
            throw createError(400, 'Invalid /thumbnail/!<Scale>p');
          }
          const metadata = await this._image.metadata();
          if (metadata.width && metadata.height) {
            this._image.resize(Math.round(metadata.width * percent * 0.01));
          } else {
            console.warn('Cannot fetch width/height in metadata');
          }
        },
      },
      {
        pattern: /^!(\d+)x(\d+)r$/m, // thumbnail/!100x100r
        proc: async (m) => {
          const w = Number.parseInt(m[1], 10);
          const h = Number.parseInt(m[2], 10);
          if (Number.isNaN(w) || w <= 0) {
            throw createError(400, 'Invalid /thumbnail/<Width>x<Height>');
          }
          if (Number.isNaN(h) || h <= 0) {
            throw createError(400, 'Invalid /thumbnail/<Width>x<Height>');
          }
          const metadata = await this._image.metadata();
          if (metadata.width && metadata.height) {
            const scaleX = w / metadata.width;
            const scaleY = h / metadata.height;
            const scale = Math.max(scaleX, scaleY);

            this._image.resize(Math.round(metadata.width * scale));
          } else {
            console.warn('Cannot fetch width/height in metadata');
          }
        },
      },
      {
        pattern: /^(\d+)x(\d+)$/m, // thumbnail/100x100
        proc: async (m) => {
          const w = Number.parseInt(m[1], 10);
          const h = Number.parseInt(m[2], 10);
          if (Number.isNaN(w) || w <= 0) {
            throw createError(400, 'Invalid /thumbnail/<Width>x<Height>');
          }
          if (Number.isNaN(h) || h <= 0) {
            throw createError(400, 'Invalid /thumbnail/<Width>x<Height>');
          }
          const metadata = await this._image.metadata();
          if (metadata.width && metadata.height) {
            // const scaleX = w / metadata.width;
            // const scaleY = h / metadata.height;
            // const scale = Math.min(scaleX, scaleY);
            // this._image.resize(Math.round(metadata.width * scale));
            this._image.resize(w,h,{ fit: 'cover'});

          } else {
            console.warn('Cannot fetch width/height in metadata');
          }
        },
      },
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const r of rules) {
      const m = v.match(r.pattern);
      if (m) {
        this._thumbnail = () => r.proc(m);
        return this;
      }
    }

    throw createError(400, 'Invalid thumbnail query');
  }

  /**
   *
   * @param {Number} w
   * @param {Number} h
   * @param {String} gravity
   * @returns this
   */

  crop(widthNumber, heightNumber, gravity) {
    const w = parseInt(widthNumber, 10);
    if (Number.isNaN(w) || w <= 0) {
      throw createError(400, 'Invalid width');
    }
    const h = parseInt(heightNumber, 10);
    if (Number.isNaN(h) || h <= 0) {
      throw createError(400, 'Invalid height');
    }
    if (gravity === 'center') {
      this._crop = async () => {
        const buffer = await this._image.toBuffer();
        const metadata = await sharp(buffer).metadata();
        if (metadata.width && metadata.height) {
          const x = (metadata.width - w) >> 1;
          const y = (metadata.height - h) >> 1;
          const region = {
            left: x,
            top: y,
            width: w,
            height: h,
          };

          this._image.extract(region);
        } else {
          console.warn('Cannot fetch width/height in metadata');
        }
      };
    } else {
      throw createError(400, 'Invalid crop gravity');
    }
    return this;
  }

  async process() {
    const image = this._image;
    const metadata = await image.metadata();

    if (this._q && (JPEG === metadata.format || JPG === metadata.format)) {
      image.jpeg({ quality: this._q });
    }
    if (this._b) {
      image.blur(50);
    }
    if (this._colorspace) {
      image.pipelineColourspace('grey16').toColourspace('srgb');
    }
    if (this._thumbnail) {
      await this._thumbnail();
    }
    if (this._crop) {
      await this._crop();
    }

    return image;
  }
}

exports.ImageMogr2 = ImageMogr2;
