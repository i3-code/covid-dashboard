const autoprefixerPlugin = require('autoprefixer');
const cssnanoPlugin = require('cssnano');

module.exports = {
  plugins: [
    autoprefixerPlugin,
    cssnanoPlugin({
      preset: [
        'default', {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
