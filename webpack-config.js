const path = require("path");
const webpack = require("webpack");

module.exports = {
  devtool: 'source-map',
  entry: 'public/static/libs/app.tsx',
  mode: "development",
  output: {
    path: path.join(__dirname, "public/static/libs/dist"),
    filename: "./app-bundle.js"
  },
  resolve: {
    extensions: ['.Webpack.js', 'web.js', '.ts', '.js', '.jsx', '.tsx']
  },
  module: {
    rules:[
      {
        test: /\.tsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader:'ts-loader'
        }
      },
      {
        test: /\.(gif|svg|jpg|png|mp3)$/,
        loader: "file-loader",
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
}