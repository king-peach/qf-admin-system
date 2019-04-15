// vue.config.js
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // 注释并删除console
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log', 'console.info'] // 移除此类语句
            }
          },
          sourceMap: true,
          parallel: true
        })
      )
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
    // 配置打包hash文件名
    config
      .output
      .filename('js/[name].[hash:3].js')
      .chunkFilename('js/[name].[chunkhash:3].js')
      .end()
    // 修复热更新失效
    config.resolve.symlinks(true)
  },
  devServer: {
    disableHostCheck: true // 禁用webpack热重载检查
  },
  baseUrl: './', // 配置打包基本路径
  lintOnSave: process.env.NODE_ENV !== 'production'
}
