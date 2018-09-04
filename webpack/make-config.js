var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = function(options) {
  var isDevelopment = options.isDevelopment;

  var plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        __DEV__: isDevelopment,
        NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
        IS_BROWSER: true,
        // https://github.com/bunkat/later/issues/155
        LATER_COV: false
      }
    })
  ];

  if (isDevelopment) {
    plugins.push(new webpack.NoErrorsPlugin());
  } else {
    plugins.push(
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.PrefetchPlugin('react'),
      new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        options: {
          context: __dirname,
          coffeelint: {
            configFile: path.resolve(__dirname, '../coffeelint.json')
          }
        }
      }),
      new ExtractTextPlugin({
        filename: 'bundle.min.css',
        allChunks: true
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      }),
      new CompressionPlugin({
        asset: '[file]',
        test: /\.(js|css)$/
      })
    );
  }

  var entry = [];
  if (isDevelopment) {
    entry = {
      bundle: [
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server',
        './src/styles/kbc.less',
        './node_modules/intl/Intl.js',
        './node_modules/intl/locale-data/jsonp/en.js',
        options.entry
      ],
      parts: [
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server',
        './src/styles/kbc.less',
        './src/scripts/parts'
      ]
    };
  } else {
    entry = {
      bundle: ['./node_modules/intl/Intl.js', './node_modules/intl/locale-data/jsonp/en.js', './src/scripts/app'],
      parts: ['./src/scripts/parts']
    };
  }

  return {
    devtool: isDevelopment ? 'eval' : 'source-map',
    entry: entry,
    output: {
      path: path.resolve(__dirname, isDevelopment ? '../dist' : '../dist/' + process.env.KBC_REVISION),
      filename: isDevelopment ? '[name].js' : '[name].min.js',
      publicPath: isDevelopment ? '/scripts/' : ''
    },
    plugins: plugins,
    resolve: {
      extensions: ['*', '.js', '.jsx', '.coffee']
    },
    module: {
      // via http://andrewhfarmer.com/aws-sdk-with-webpack/
      noParse: /aws\-sdk/,
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'eslint-loader',
          options: {
            failOnWarning: false,
            failOnError: true,
            configFile: path.resolve(__dirname, '../.eslintrc')
          }
        },
        {
          test: /\.coffee$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'coffee-lint-loader'
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, '../src/scripts'),
          use: isDevelopment ? ['react-hot', 'babel-loader'] : ['babel-loader']
        },
        {
          test: /\.coffee$/,
          exclude: /node_modules/,
          use: isDevelopment ? ['react-hot-loader', 'coffee-loader'] : ['coffee-loader']
        },
        {
          test: /\.less$/,
          use: isDevelopment
            ? ['style-loader', 'css-loader', 'less-loader']
            : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'less-loader']
            })
        },
        {
          test: /.(png|woff|woff2|eot|ttf|svg|jpg|mp3)/,
          loader: 'file-loader'
        }
      ]
    }
  };
};
