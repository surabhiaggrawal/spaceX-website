var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './js/app.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'app.bundle.js'
     },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                  }          
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };