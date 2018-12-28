// vue.config.js
// const path = require('path')
// function resolve(dir) {
//   console.log(__dirname)
//   return path.join(__dirname, dir)
// }
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  // chainWebpack: config => {
  //   // 配置路径别名
  //   config.resolve.alias
  //     .set('@', resolve('src'))
  //     .set('assets', resolve('src/assets'))
  // },
  baseUrl: process.env.NODE_ENV === 'production' ? '"http://dev.huario.com:8080/api"' : '/',
  lintOnSave: process.env.NODE_ENV !== 'production'
}
