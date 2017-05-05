'use strict'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const host = 'http://localhost'
const port = 8000

module.exports = {
    entry: [
        './src/'
    ],
    output: {
        filename: 'bundle.js',
        path: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: false,
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.(woff2?|svg|ttf|otf|png|eot|jpe?g)$/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new webpack.HotModuleReplacementPlugin(),
        new ProgressBarPlugin()
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 8000,
        contentBase: './public',
        stats: 'errors-only'
    }
};