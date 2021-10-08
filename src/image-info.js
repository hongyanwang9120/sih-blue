const sharp = require('sharp');
const createError = require('http-errors');

class ImageInfo {
  constructor(image) {
    if (!image) {
      throw createError(500, 'Empty image');
    }
    if (!(image instanceof sharp)) {
      throw createError(500, 'Image must be a sharp object');
    }
    this._image = image;
  }

  async process() {
    const image = this._image;
    const metadata = await image.metadata();

    return {
      size: metadata.size,
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      colorModel: metadata.space,
      // orientation: metadata.orientation, // TODO: convert number ot string
    };
  }
}

exports.ImageInfo = ImageInfo;
