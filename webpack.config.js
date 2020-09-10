const webpack = require("webpack")
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const HtmlPlugin = require("html-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent")

// Constants

const MODE = process.env.NODE_ENV || "development"
const DEV = MODE == "development"

const USE_CUSTOM_SRC = !!process.env.SRC
const SRC = path.join(__dirname, process.env.SRC || "src")

const SRC_INCLUDES = [
  path.join(__dirname, "src"),
  ...(process.env.SRC ? [SRC] : [])
]
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve("style-loader"),
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          })
        ]
      }
    }
  ]
  if (preProcessor) {
    loaders.push(require.resolve(preProcessor))
  }
  return loaders
}
const COPY_RULES = [
  {
    from: path.join(__dirname, "src/manifest.json"),
    to: path.join(__dirname, "/dist/manifest.json")
  },
  {
    from: path.join(__dirname, "/assets/favicon.ico"),
    to: path.join(__dirname, "/dist/favicon.ico")
  },
  {
    from: path.join(__dirname, "/assets/image.jpg"),
    to: path.join(__dirname, "/dist/image.jpg")
  },
  {
    from: path.join(__dirname, "assets/**"),
    to: path.join(__dirname, "dist")
  },
  {
    from: path.join(
      __dirname,
      "node_modules/@blueprintjs/icons/resources/icons"
    ),
    to: path.join(__dirname, "dist/resources/icons")
  }
]

if (USE_CUSTOM_SRC) {
  console.info("You are using custom entry:", SRC)
}

const plugins = [
  new HtmlPlugin({
    inject: false,
    template: path.join(SRC, "index.html.ejs")
  }),
  new CopyPlugin(COPY_RULES),
  new webpack.ProvidePlugin({
    BrowserFS: "bfsGlobal",
    process: "processGlobal",
    Buffer: "bufferGlobal"
  })
]

module.exports = {
  mode: MODE,
  // devtool: DEV ? "inline-source-map" : "source-map",
  entry: { main: SRC },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    alias: {
      fs: "browserfs/dist/shims/fs.js",
      buffer: "browserfs/dist/shims/buffer.js",
      path: "browserfs/dist/shims/path.js",
      processGlobal: "browserfs/dist/shims/process.js",
      bufferGlobal: "browserfs/dist/shims/bufferGlobal.js",
      bfsGlobal: require.resolve("browserfs")
    },
    // alias: {
    //   fs: path.join(__dirname, "src/lib/fs.ts")
    // },
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".css",
      ".scss",
      ".ttf",
      ".woff",
      ".woff2",
      ".eot",
      ".svg"
    ]
  },
  node: {
    process: false,
    Buffer: false
  },
  module: {
    noParse: /browserfs\.js/,
    rules: [
      {
        test: /\.(jpg|jpeg|png)$/,
        use: [{ loader: "url-loader" }]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      // {
      //   test: /\.tsx?$/,
      //   use: [
      //     {
      //       loader: "babel-loader"
      //     }
      //   ]
      // },
      {
        test: /\.js$/,
        include: SRC_INCLUDES,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader/url" }, { loader: "file-loader" }]
      },

      {
        test: /\.mdx?$/,
        use: ["babel-loader", "@mdx-js/loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      },
      // {
      //   test: sassRegex,
      //   use: [
      //     { loader: "style-loader" },
      //     {
      //       loader: "typings-for-css-modules-loader"
      //     },
      //     { loader: "sass-loader" }
      //   ]
      // },
      // {
      //   test: sassModuleRegex,
      //   use: [
      //     { loader: "style-loader" },
      //     {
      //       loader: "typings-for-css-modules-loader",
      //       options: {
      //         modules: true
      //       }
      //     },
      //     { loader: "sass-loader" }
      //   ]
      // }
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders({ importLoaders: 2 }, "sass-loader")
      },
      // Adds support for CSS Modules, but using SASS
      // using the extension .module.scss or .module.sass
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent
          },
          "sass-loader"
        )
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: DEV
    ? plugins
    : [
        ...plugins,
        new WorkboxPlugin.GenerateSW({
          swDest: "sw.js",
          clientsClaim: true,
          skipWaiting: true,
          exclude: ["assets/icon-*.png"]
        })
      ]
}
