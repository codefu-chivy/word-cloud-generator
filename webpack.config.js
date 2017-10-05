var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: path.join(__dirname, "src", "index"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            loader: ["babel-loader"],
            query: {
                cacheDirectory: "babel-cache"
            }
        }],
        rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
    },
    resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]
}