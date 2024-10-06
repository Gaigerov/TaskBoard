const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (_, {mode}) => {
    return {
        mode: 'development',
        entry: './src/App.jsx',
        output: {
            path: path.resolve(__dirname, 'build'),
            clean: true,
        },
        optimization: {
            minimizer: [new CssMinimizerPlugin(),
            new HtmlMinimizerPlugin()
            ],
        },
        devServer: {
            static: './dist',
            open: true,
            port: 3000,
            hot: true,
            historyApiFallback: true,
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[hash][ext]',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[hash][ext]',
                    },
                },
                {
                    test: /\.(jsx|js)$/,
                    include: path.resolve(__dirname, 'src'),
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            targets: 'defaults',
                                        },
                                    ],
                                    '@babel/preset-react',
                                ],
                                plugins: ['transform-class-properties'],
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/App.html',
            }),
            new MiniCssExtractPlugin(),
        ],
    };
};
