const sharp = require('sharp');
const { S3Store } = require('./store');
const { ImageView2 } = require('./image-view2');

const bucket = process.env.SOURCE_BUCKETS.split(',')[0];
const store = new S3Store(bucket);

const rules = [
  {
    pattern: '/private_message((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)$',
    repl: '/private_message${1}/${2}.${3}!o.png?imageMogr2/thumbnail/!30p',
    example_input: '/private_message/photos/1559109545_11790.png',
    example_output: '/private_message/photos/1559109545_11790.png!o.png?imageMogr2/thumbnail/!30p',
  },
  {
    pattern: '/blued/mrright.+$',
    repl: '${0}?imageMogr2/thumbnail/!33p',
    example_input: '/blued/mrright/408119/408119_1433488325.png',
    example_output: '/blued/mrright/408119/408119_1433488325.png?imageMogr2/thumbnail/!33p',
  },
  {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg$',
    repl: '/userfiles${1}!Background.jpg!o.png?imageView2/2/w/480/h/820',
    example_input: '/userfiles/009/334/225/85338!Background.jpg',
    example_output: '/userfiles/009/334/225/85338!Background.jpg!o.png?imageView2/2/w/480/h/820',
    async process(pathname, match) {
      const key = `userfiles${match[1]}!Background.jpg!o.png`;
      const buffer = await store.get(key);
      const iv2 = new ImageView2(sharp(buffer));

      const out = await iv2.m(2).w(480).h(820).process();

      return out.toBuffer({ resolveWithObject: true });
    },
  },
  {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg(?:%21|!)48$',
    repl: '/userfiles${1}!Background.jpg!o.png?imageView2/2/w/480/h/820/q/48',
    example_input: '/userfiles/009/334/225/85338!Background.jpg!48',
    example_output: '/userfiles/009/334/225/85338!Background.jpg!o.png?imageView2/2/w/480/h/820/q/48',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)m[.]png$',
    repl: '/avatars${1}/${2}.${3}?imageMogr2/thumbnail/480x',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!m.png',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageMogr2/thumbnail/480x',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)l[.]png$',
    repl: '/avatars${1}/${2}.${3}?imageMogr2/thumbnail/720x',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!l.png',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageMogr2/thumbnail/720x',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png$',
    repl: '/avatars${1}/${2}.${3}',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!o.png',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:(?:%21|!)s[.]png)?$',
    repl: '/avatars${1}/${2}.${3}?imageView2/1/w/192/h/192',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!s.png',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageView2/1/w/192/h/192',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/avatars${1}/${2}.${3}?imageView2/1/w/${4}/h/${5}',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!200x200.png',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageView2/1/w/200/h/200',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)m[.]png(?:%21|!)48$',
    repl: '/avatars${1}/${2}.${3}?imageMogr2/thumbnail/480x/quality/48',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!m.png!48',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageMogr2/thumbnail/480x/quality/48',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)l[.]png(?:%21|!)48$',
    repl: '/avatars${1}/${2}.${3}?imageMogr2/thumbnail/720x/quality/48',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!l.png!48',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageMogr2/thumbnail/720x/quality/48',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png(?:%21|!)48$',
    repl: '/avatars${1}/${2}.${3}',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!o.png!48',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:(?:%21|!)s[.]png)?(?:%21|!)48$',
    repl: '/avatars${1}/${2}.${3}?imageView2/1/w/192/h/192/q/48',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!s.png!48',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageView2/1/w/192/h/192/q/48',
  },
  {
    pattern: '/avatars((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/avatars${1}/${2}.${3}?imageView2/1/w/${4}/h/${5}/q/48',
    example_input: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png!200x200.png!48',
    example_output: '/avatars/c8573157bcfea2ed163bdf2c52e6e238-1464334585-25850.png?imageView2/1/w/200/h/200/q/48',
  }, {
    example_input: '/userfiles/000/000/002/17!Head.png!m.png?imageInfo',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageMogr2/thumbnail/480x|imageInfo',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)m[.]png[?]imageInfo$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/thumbnail/480x|imageInfo',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!m.png',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageMogr2/thumbnail/480x',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)m[.]png$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/thumbnail/480x',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!m.png!48',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageMogr2/thumbnail/480x/quality/48',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)m[.]png(?:%21|!)48$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/thumbnail/480x/quality/48',
  }, {
    example_input: '/userfiles/000/000/002/17!Head.png!l.png?imageInfo',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageMogr2/thumbnail/720x|imageInfo',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)l[.]png[?]imageInfo$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/thumbnail/720x|imageInfo',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!l.png',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageMogr2/thumbnail/720x',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)l[.]png$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/thumbnail/720x',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!original.png',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)o(?:riginal)?[.]png$',
    repl: '/userfiles${1}!Head.${2}!o.png',
  },

  {
    example_input: '/userfiles/000/000/002/17!Head.png!l.png!48',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageMogr2/thumbnail/720x/quality/48',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)l[.]png(?:%21|!)48$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/thumbnail/720x/quality/48',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!original.png!48',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)o(?:riginal)?[.]png(?:%21|!)48$',
    repl: '/userfiles${1}!Head.${2}!o.png',
  }, {
    example_input: '/userfiles/000/000/002/17!Head.png!s.png?imageInfo',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/192/h/192|imageInfo',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:(?:%21|!)s[.]png)?[?]imageInfo$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/192/h/192|imageInfo',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!s.png',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/192/h/192',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:(?:%21|!)s[.]png)?$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/192/h/192',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!s.png!gray.png',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/192/h/192|imageMogr2/colorspace/gray',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:(?:%21|!)s[.]png)?(?:%21|!)gray[.]png$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/192/h/192|imageMogr2/colorspace/gray',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!s.png!48',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/192/h/192/q/48',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:(?:%21|!)s[.]png)?(?:%21|!)48$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/192/h/192/q/48',
  }, {
    example_input: '/userfiles/000/000/002/17!Head.png!200x200.png?imageInfo',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/200/h/200|imageInfo',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png[?]imageInfo$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/${3}/h/${4}|imageInfo',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!200x200.png',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/200/h/200',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/${3}/h/${4}',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!gray.png!200x200.png',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/200/h/200|imageMogr2/colorspace/gray',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)gray.png(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/${3}/h/${4}|imageMogr2/colorspace/gray',
  },
  {
    example_input: '/userfiles/000/000/002/17!Head.png!200x200.png!48',
    example_output: '/userfiles/000/000/002/17!Head.png!o.png?imageView2/1/w/200/h/200/q/48',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageView2/1/w/${3}/h/${4}/q/48',
  }, {
    example_input: '/userfiles/022/900/481/78855!Head.jpg!mogr.png?imageInfo',
    example_output: '/userfiles/022/900/481/78855!Head.jpg!o.png?imageMogr2/blur/50x50/thumbnail/192x192|imageInfo',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)mogr[.]png[?]imageInfo$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/blur/50x50/thumbnail/192x192|imageInfo',
  },
  {
    example_input: '/userfiles/022/900/481/78855!Head.jpg!mogr.png',
    example_output: '/userfiles/022/900/481/78855!Head.jpg!o.png?imageMogr2/blur/50x50/thumbnail/192x192',
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Head[.](\\w+)(?:%21|!)mogr[.]png$',
    repl: '/userfiles${1}!Head.${2}!o.png?imageMogr2/blur/50x50/thumbnail/192x192',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!m.png?imageInfo',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageMogr2/thumbnail/480x|imageInfo',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)m[.]png[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/480x|imageInfo',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!m.png',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageMogr2/thumbnail/480x',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)m[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/480x',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!m.png!48',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageMogr2/thumbnail/480x/quality/48',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)m[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/480x/quality/48',
  }, {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!l.png?imageInfo',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageMogr2/thumbnail/720x|imageInfo',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)l[.]png[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/720x|imageInfo',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!l.png',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageMogr2/thumbnail/720x',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)l[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/720x',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!original.png',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!l.png!48',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageMogr2/thumbnail/720x/quality/48',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)l[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/720x/quality/48',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!original.png!48',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png',
  }, {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!s.png?imageInfo',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageView2/1/w/192/h/192|imageInfo',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:(?:%21|!)s[.]png)?[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/1/w/192/h/192|imageInfo',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!s.png',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageView2/1/w/192/h/192',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:(?:%21|!)s[.]png)?$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/1/w/192/h/192',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!s.png!48',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageView2/1/w/192/h/192/q/48',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:(?:%21|!)s[.]png)?(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/1/w/192/h/192/q/48',
  }, {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!200x200.png?imageInfo',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageView2/1/w/200/h/200|imageInfo',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/1/w/${5}/h/${6}|imageInfo',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!200x200.png',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageView2/1/w/200/h/200',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/1/w/${5}/h/${6}',
  },
  {
    example_input: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!200x200.png!48',
    example_output: '/userfiles/005/014/705/photos/1428846001472/1428846001472.png!o.png?imageView2/1/w/200/h/200/q/48',
    pattern: '/(userfiles|groupfiles)((?:/\\w\\w*)*)/(\\d+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/1/w/${5}/h/${6}/q/48',
  }, {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!m.png?imageInfo',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/480x|imageInfo',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)m[.]png[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/480x|imageInfo',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!m.png',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/480x',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)m[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/480x',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!m.png!48',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/480x/quality/48',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)m[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/480x/quality/48',
  }, {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!l.png?imageInfo',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/720x|imageInfo',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)l[.]png[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/720x|imageInfo',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!l.png',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/720x',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)l[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/720x',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!original.png',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!l.png!48',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/720x/quality/48',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)l[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/720x/quality/48',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!original.png!48',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png',
  }, {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!s.png?imageInfo',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/360x|imageInfo',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:(?:%21|!)s[.]png)?[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/360x|imageInfo',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!s.png',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/360x',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:(?:%21|!)s[.]png)?$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/360x',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!s.png!48',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageMogr2/thumbnail/360x/quality/48',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:(?:%21|!)s[.]png)?(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageMogr2/thumbnail/360x/quality/48',
  }, {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!480x720.png?imageInfo',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageView2/2/w/480/h/720|imageInfo',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png[?]imageInfo$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/2/w/${5}/h/${6}|imageInfo',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!480x720.png',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageView2/2/w/480/h/720',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/2/w/${5}/h/${6}',
  },
  {
    example_input: '/userfiles/004/538/761/4538761_26168_1428898495.png!480x720.png!48',
    example_output: '/userfiles/004/538/761/4538761_26168_1428898495.png!o.png?imageView2/2/w/480/h/720/q/48',
    pattern: '/(userfiles|ingfiles)((?:/\\w\\w*)*)/([\\d_]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.${4}!o.png?imageView2/2/w/${5}/h/${6}/q/48',
  }, {
    pattern: '/blued/mrright.+$',
    repl: '${0}?imageMogr2/thumbnail/!33p',
    example_input: '/blued/mrright/408119/408119_1433488325.png',
    example_output: '/blued/mrright/408119/408119_1433488325.png?imageMogr2/thumbnail/!33p',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)m[.]png$',
    repl: '/topics/${1}.${2}?imageMogr2/thumbnail/480x',
    example_input: '/topics/20150615_12_1434337587.jpg!m.png',
    example_output: '/topics/20150615_12_1434337587.jpg?imageMogr2/thumbnail/480x',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)l[.]png$',
    repl: '/topics/${1}.${2}?imageMogr2/thumbnail/720x',
    example_input: '/topics/20150615_12_1434337587.jpg!l.png',
    example_output: '/topics/20150615_12_1434337587.jpg?imageMogr2/thumbnail/720x',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png$',
    repl: '/topics/${1}.${2}',
    example_input: '/topics/20150615_12_1434337587.jpg!o.png',
    example_output: '/topics/20150615_12_1434337587.jpg',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:(?:%21|!)s[.]png)?$',
    repl: '/topics/${1}.${2}?imageView2/1/w/192/h/192',
    example_input: '/topics/20150615_12_1434337587.jpg!s.png',
    example_output: '/topics/20150615_12_1434337587.jpg?imageView2/1/w/192/h/192',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/topics/${1}.${2}?imageView2/1/w/${3}/h/${4}',
    example_input: '/topics/20150615_12_1434337587.jpg!200x200.png',
    example_output: '/topics/20150615_12_1434337587.jpg?imageView2/1/w/200/h/200',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)m[.]png(?:%21|!)48$',
    repl: '/topics/${1}.${2}?imageMogr2/thumbnail/480x/quality/48',
    example_input: '/topics/20150615_12_1434337587.jpg!m.png!48',
    example_output: '/topics/20150615_12_1434337587.jpg?imageMogr2/thumbnail/480x/quality/48',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)l[.]png(?:%21|!)48$',
    repl: '/topics/${1}.${2}?imageMogr2/thumbnail/720x/quality/48',
    example_input: '/topics/20150615_12_1434337587.jpg!l.png!48',
    example_output: '/topics/20150615_12_1434337587.jpg?imageMogr2/thumbnail/720x/quality/48',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png(?:%21|!)48$',
    repl: '/topics/${1}.${2}',
    example_input: '/topics/20150615_12_1434337587.jpg!o.png!48',
    example_output: '/topics/20150615_12_1434337587.jpg',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:(?:%21|!)s[.]png)?(?:%21|!)48$',
    repl: '/topics/${1}.${2}?imageView2/1/w/192/h/192/q/48',
    example_input: '/topics/20150615_12_1434337587.jpg!s.png!48',
    example_output: '/topics/20150615_12_1434337587.jpg?imageView2/1/w/192/h/192/q/48',
  },
  {
    pattern: '/topics/([\\d_]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/topics/${1}.${2}?imageView2/1/w/${3}/h/${4}/q/48',
    example_input: '/topics/20150615_12_1434337587.jpg!200x200.png!48',
    example_output: '/topics/20150615_12_1434337587.jpg?imageView2/1/w/200/h/200/q/48',
  }, {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:(?:%21|!)750x396[.]png)?$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!750x396r/gravity/Center/crop/750x396/dx/0/dy/0',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!750x396.png',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!750x396r/gravity/Center/crop/750x396/dx/0/dy/0',
  },
  {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:%21|!)(?:750x190|m)[.]png$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!750x190r/gravity/Center/crop/750x190/dx/0/dy/0',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!750x190.png',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!750x190r/gravity/Center/crop/750x190/dx/0/dy/0',
  },
  {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:%21|!)(?:220x220|s)[.]png$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!220x220r/gravity/Center/crop/220x220/dx/0/dy/0',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!220x220.png',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!220x220r/gravity/Center/crop/220x220/dx/0/dy/0',
  },
  {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!${4}x${5}r/gravity/Center/crop/${4}x${5}/dx/0/dy/0',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!200x400.png',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!200x400r/gravity/Center/crop/200x400/dx/0/dy/0',
  },
  {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:(?:%21|!)750x396[.]png)?(?:%21|!)48$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!750x396r/gravity/Center/crop/750x396/dx/0/dy/0/quality/48',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!750x396.png!48',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!750x396r/gravity/Center/crop/750x396/dx/0/dy/0/quality/48',
  },
  {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:%21|!)(?:750x190|m)[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!750x190r/gravity/Center/crop/750x190/dx/0/dy/0/quality/48',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!750x190.png!48',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!750x190r/gravity/Center/crop/750x190/dx/0/dy/0/quality/48',
  },
  {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:%21|!)(?:220x220|s)[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!220x220r/gravity/Center/crop/220x220/dx/0/dy/0/quality/48',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!220x220.png!48',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!220x220r/gravity/Center/crop/220x220/dx/0/dy/0/quality/48',
  },
  {
    pattern: '/(livefiles|userfiles)((?:/\\w\\w*)*)/([\\d_]+)[.]png(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/${1}${2}/${3}.png!o.png?imageMogr2/thumbnail/!${4}x${5}r/gravity/Center/crop/${4}x${5}/dx/0/dy/0/quality/48',
    example_input: '/livefiles/000/000/098/photos/98_35196_1447573874.png!200x400.png!48',
    example_output: '/livefiles/000/000/098/photos/98_35196_1447573874.png!o.png?imageMogr2/thumbnail/!200x400r/gravity/Center/crop/200x400/dx/0/dy/0/quality/48',
  }, {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)m[.]png[?]imageInfo$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/480x|imageInfo',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!m.png?imageInfo',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/480x|imageInfo',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)m[.]png$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/480x',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!m.png',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/480x',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([[\\w-]+)[.](\\w+)(?:%21|!)m[.]png(?:%21|!)48$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/480x/quality/48',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!m.png!48',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/480x/quality/48',
  }, {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)l[.]png[?]imageInfo$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/720x|imageInfo',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!l.png?imageInfo',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/720x|imageInfo',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)l[.]png$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/720x',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!l.png',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/720x',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png$',
    repl: '/advertise${1}/${2}.${3}',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!o.png',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)l[.]png(?:%21|!)48$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/720x/quality/48',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!l.png!48',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/720x/quality/48',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)o(?:riginal)?[.]png(?:%21|!)48$',
    repl: '/advertise${1}/${2}.${3}',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!o.png!48',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png',
  }, {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:(?:%21|!)s[.]png)?[?]imageInfo$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/360x|imageInfo',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!s.png?imageInfo',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/360x|imageInfo',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:(?:%21|!)s[.]png)?$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/360x',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!s.png',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/360x',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:(?:%21|!)s[.]png)?(?:%21|!)48$',
    repl: '/advertise${1}/${2}.${3}?imageMogr2/thumbnail/360x/quality/48',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!s.png!48',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageMogr2/thumbnail/360x/quality/48',
  }, {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png[?]imageInfo$',
    repl: '/advertise${1}/${2}.${3}?imageView2/2/w/${4}/h/${5}|imageInfo',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!480x720.png?imageInfo',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageView2/2/w/480/h/720|imageInfo',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/advertise${1}/${2}.${3}?imageView2/2/w/${4}/h/${5}',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!480x720.png',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageView2/2/w/480/h/720',
  },
  {
    pattern: '/advertise((?:/\\w\\w*)*)/([\\w-]+)[.](\\w+)(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/advertise${1}/${2}.${3}?imageView2/2/w/${4}/h/${5}/q/48',
    example_input: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png!480x720.png!48',
    example_output: '/advertise/pics/f99687dd719c4e8bc6a39e946c3d9ef7-1463645316-10851.png?imageView2/2/w/480/h/720/q/48',
  }, {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png$',
    repl: '/userfiles${1}!Background.jpg!o.png?imageView2/2/w/${2}/h/${3}',
    example_input: '/userfiles/009/334/225/85338!Background.jpg!640x1090.png',
    example_output: '/userfiles/009/334/225/85338!Background.jpg!o.png?imageView2/2/w/640/h/1090',
  },
  {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg(?:%21|!)o(?:riginal)?[.]png$',
    repl: '/userfiles${1}!Background.jpg!o.png',
    example_input: '/userfiles/009/334/221/37115!Background.jpg!original.png',
    example_output: '/userfiles/009/334/221/37115!Background.jpg!o.png',
  },
  {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg$',
    repl: '/userfiles${1}!Background.jpg!o.png?imageView2/2/w/480/h/820',
    example_input: '/userfiles/009/334/225/85338!Background.jpg',
    example_output: '/userfiles/009/334/225/85338!Background.jpg!o.png?imageView2/2/w/480/h/820',
  },
  {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg(?:%21|!)([1-9]\\d*)x([1-9]\\d*)[.]png(?:%21|!)48$',
    repl: '/userfiles${1}!Background.jpg!o.png?imageView2/2/w/${2}/h/${3}/q/48',
    example_input: '/userfiles/009/334/225/85338!Background.jpg!640x1090.png!48',
    example_output: '/userfiles/009/334/225/85338!Background.jpg!o.png?imageView2/2/w/640/h/1090/q/48',
  },
  {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg(?:%21|!)o(?:riginal)?[.]png(?:%21|!)48$',
    repl: '/userfiles${1}!Background.jpg!o.png',
    example_input: '/userfiles/009/334/221/37115!Background.jpg!original.png!48',
    example_output: '/userfiles/009/334/221/37115!Background.jpg!o.png',
  },
  {
    pattern: '/userfiles((?:/\\w\\w*)*)(?:%21|!)Background[.]jpg(?:%21|!)48$',
    repl: '/userfiles${1}!Background.jpg!o.png?imageView2/2/w/480/h/820/q/48',
    example_input: '/userfiles/009/334/225/85338!Background.jpg!48',
    example_output: '/userfiles/009/334/225/85338!Background.jpg!o.png?imageView2/2/w/480/h/820/q/48',
  },
];

exports.find = function (pathname) {
  // eslint-disable-next-line no-restricted-syntax
  for (const rule of rules) {
    const m = pathname.match(rule.pattern);
    if (m && rule.process) {
      const fn = function () {
        return rule.process.bind(rule)(pathname, m);
      };
      fn.rule = rule;
      return fn;
    }
  }
  return null;
};
