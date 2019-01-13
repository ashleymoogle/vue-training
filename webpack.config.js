const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const merge = require('webpack-merge');
const argv = require('yargs').argv;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const TARGET = argv.env || 'development';
//const TARGET = argv.env || 'production';

const SERVE = process.env.npm_lifecycle_event || 'build';

const developmentConfig = require('./config/webpack-dev');

const config = {
    mode: TARGET,
    stats: 'minimal',
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 4,
                    enforce: true
                }
            }
        }
    },
    entry: {
        app: path.resolve(__dirname, "src"),
    },
    output: {
        path: path.join(__dirname, '/build/dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        pathinfo: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            minimize: TARGET === 'production'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('autoprefixer')({
                                    browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            outFile: path.resolve(__dirname, './client/css'),
                            outputStyle: 'compressed',
                            sourceMapContents: true,
                            includePaths: [
                                path.resolve(__dirname, 'client/scss')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].bundle.css',
            disable: false,
            allChunks: true
        }),
        new CopyWebpackPlugin([
            { from: 'src/index.html', to: path.resolve(__dirname, 'build') }
        ]),
        new ManifestPlugin({
            fileName: path.join(__dirname, '/build/manifest.json'),
            filter: function(file) {
                return !file.name.includes('fonts/') && !file.name.includes('.map') && !file.name.includes('.gz');
            },
            map: function(file) {
                file.name = file.name.replace('.', '_');
                return file;
            }
        })
    ]
};

let conf = config;
if (TARGET === 'production') {
    conf = merge.smart(config, {
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true)
            }),
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: true
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: { discardComments: { removeAll: true } },
                canPrint: true
            }),
            new CompressionPlugin({
                test: /\.bundle.js$/
            })
        ]
    });
} else {
    conf = merge.smart(config, {
        devtool: 'source-map',
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false)
            })
        ]
    });
}

if ((SERVE === 'start') || (SERVE === undefined)) {
    console.log('start dev server');
    conf = merge(config, {
        debug: true,
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true),
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
        ],
        devtool: 'eval'
    });

    conf = merge(config, developmentConfig.devServer())
}

module.exports = conf;