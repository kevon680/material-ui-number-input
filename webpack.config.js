const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        'webpack-hot-middleware/client',
        "./Dev/index.tsx"
    ],

    output: {
        path: path.join(__dirname, "demo"),
        filename: "[name].js",
        publicPath: ''
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ title: "Material-Ui Number Input" })
    ],

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ["ts-loader"]
            }
        ],
    }
};
