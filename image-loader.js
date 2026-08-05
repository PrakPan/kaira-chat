// image-loader.js
//
// Global custom loader for `next/image` (wired in next.config.js). next/image
// calls this for every <Image> with the target display `width` (and srcset
// widths), so our own media is automatically requested at the right size via
// the Serverless Image Handler. External hosts and local assets are returned
// unchanged, so there is no visible difference — only far fewer bytes.

const { optimizedMediaUrl } = require("./lib/mediaImage");

module.exports = function ttwImageLoader({ src, width, quality }) {
  return optimizedMediaUrl(src, { width, quality: quality || 80 });
};
