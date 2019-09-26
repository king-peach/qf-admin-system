const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'youname.js'
  },
  plugins: [
  ],
  devServer: {
    contentBase: path.join(__dirname, 'page'),
    compress: true,
    port: 8080
  }
}
