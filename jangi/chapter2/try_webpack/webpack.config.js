const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, 'src/app.js')
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env', {
                                targets: {
                                    node: 'current',
                                    esmodules: true,
                                },
                                modules: false,
                                useBuiltIns: 'usage',
                                corejs: 3
                            }
                        ]
                    ],
                    plugins: ['@babel/plugin-proposal-class-properties']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        esModule: false,
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        esModule: false
                    }
                }]
            },
            {
                test: /\.wav$/,
                loader: "file-loader",
                options: {
                  publicPath: "./dist/",
                  name: "[name].[ext]?[hash]",
                },
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
			filename: './index.css',
			chunkFilename: '[id].css',
		}),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            hash: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css'],
    },
}