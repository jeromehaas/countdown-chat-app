const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/main.js',
    resolve: {
        extensions: [ '.webpack.js', '.js' ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/env' ],
                        plugins: ["@babel/plugin-transform-object-assign"],
                    }
                }
            }
        ]
    }
};
