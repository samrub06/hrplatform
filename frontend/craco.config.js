const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'client-sdk': path.resolve(__dirname, 'node_modules/client-sdk')
      };

      webpackConfig.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, 'node_modules/client-sdk'),
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
};