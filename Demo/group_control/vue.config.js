const webpack = require('webpack')
const packageInfo = require('./package.json');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/ucloudgame/' : '/',
    outputDir: `ucloudgame-${packageInfo.version}`,
    indexPath: 'index.html',
    //引入jquery
    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }])
        config.module
            .rule("worker")
            // .test(/\.worker\.js$/)
            .test(/\.worker\.(c|m)?js$/i)
            .use("worker")
            .loader("worker-loader")
            .options({
                inline: "fallback",
                filename: "[name].[contenthash].worker.js"
            })
        .end();
        config.output.globalObject('this')
    },
    parallel: false,
    devServer: {
        hot: true,
        https: true,
        useLocalIp: true,
        port: 8080,
        proxy: {
            '/profile': {
                target: 'https://signal.ugame.ucloud.cn:8001',
                changeOrigin: true,
                ws: true,
                secure: false,
                pathRewrite: {
                    '^/profile': ''
                }
            },
            '/api': {
                target: 'https://api.ucloud.cn',
                //target: 'https://api-test03.ucloudadmin.com',
                changeOrigin: true,
                // ws: true,
                secure: true,
                pathRewrite: {
                    '^/api': ''
                },

                // cookieDomainRewrite: {
                //     'api-test03.ucloudadmin.com': 'localhost'
                // }
            },
            // '/test03': {
            //     target: 'https://api-test03.ucloudadmin.com',
            //     changeOrigin: true,
            //     ws: true,
            //     secure: false,
            //     pathRewrite: {
            //         '^/test03': ''
            //     }
            // }
        }
    }
}