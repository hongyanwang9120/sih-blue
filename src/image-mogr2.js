const sharp = require('sharp');
const createError = require('http-errors');

class ImageMogr2 {
  constructor(image) {
    if (!image) {
      throw createError(500, 'Empty image');
    }
    if (!(image instanceof sharp)) {
      throw createError(500, 'Image must be a sharp object');
    }
    this._image = image;
    this._thumbnail = async () => {};
  }

  /**
   * https://developer.qiniu.com/dora/8255/the-zoom
   * @param {*} v
   * @returns
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
            const scaleX = w / metadata.width;
            const scaleY = h / metadata.height;
            const scale = Math.min(scaleX, scaleY);

            this._image.resize(Math.round(metadata.width * scale));
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

  async process() {
    const image = this._image;

    if (this._thumbnail) {
      await this._thumbnail();
    }

    return image;
  }
}

exports.ImageMogr2 = ImageMogr2;
