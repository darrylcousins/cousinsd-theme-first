const {join} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const package = require('./package.json');
const path = require("path");
const fs = require("fs");

/* This file is for webpack-dev-server only */
const api = (req, res) => {
  const fpath = join(__dirname, 'public', req.url);
  fs.readFile(fpath, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(data);
      res.end();
    } else {
      console.log('error', err);
    }
  });
  console.log(fpath);
};

module.exports = {
  entry: {
    'vendor': Object.keys(package.dependencies),
    'boxes': join(__dirname, 'scripts/boxes-dev.js')
  },
  output: {
    path: join(__dirname, 'public'),
    filename: '[name].bundle.js',
  },
  devServer: {
    inline: true,
    port: 8080,
    publicPath: '/',
    hot: true,

    before: (app, server, compiler) => {
      app.get("/cart-empty.js", function(req, res){
        api(req, res);
      });
      app.get("/cart.js", function(req, res){
        api(req, res);
      });
      app.get("/products/*", function(req, res){
        api(req, res);
      });
      /*
      // fallback to index.html if using react router url routing
          historyApiFallback: true
      app.get("/:object", function(req, res){
        console.log(req.params);
        return res;
      })
      var bodyParser = require('body-parser');    
      app.use(bodyParser.json());
      app.post("/post/some-data", bodyParser.json(), function(req, res){
        console.log(req.body);
        res.send("POST res sent from webpack dev server")
      });
      */
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'My Awesome application',
      myPageHeader: 'Boxes Cart',
      template: './public/index.html',
      chunks: ['vendor', 'boxes'],
      path: path.join(__dirname, "public/"),
      filename: 'index.html' 
    }),
    new webpack.DefinePlugin({'LOCAL': JSON.stringify('local')})
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: join(__dirname, 'scripts'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ["@babel/preset-env", {"targets": { "node": "current" }}],
                '@babel/react',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {},
  }
};
