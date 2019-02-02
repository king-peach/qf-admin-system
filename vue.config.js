// vue.config.js
const path = require('path')
function resolve(dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    // 配置svg路径
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/icons'))
      .end()
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // 配置路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
  },
  baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    // 开发环境下设置跨域解决方案
    proxy: {
      '/': {
        target: 'http://94.191.36.181/',
        changeOrigin: true
      }
    }
  }
}
