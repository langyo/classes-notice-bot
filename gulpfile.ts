import { series, watch, src, dest } from 'gulp';
import * as webpack from 'webpack-stream';
import { join } from 'path';

export const taskBuild = series(
  function webpackBuildForWeb() {
    return src(join(__dirname, './src/web/index.tsx'))
      .pipe(
        webpack({
          module: {
            rules: [
              {
                test: /\.[jt]sx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                  presets: [
                    '@babel/preset-env',
                    [
                      '@babel/preset-react',
                      {
                        runtime: 'automatic',
                        importSource: '@emotion/react',
                      },
                    ],
                    '@babel/preset-typescript',
                  ],
                  plugins: [
                    '@babel/plugin-transform-runtime',
                    '@emotion/babel-plugin',
                  ],
                },
              },
              {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
              },
            ],
          },
          resolve: {
            extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
            modules: [join(__dirname, './node_modules'), 'node_modules'],
          },
          resolveLoader: {
            modules: [join(__dirname, './node_modules'), 'node_modules'],
          },
          mode:
            process.env.NODE_ENV === 'development'
              ? 'development'
              : 'production',
          target: 'web',
          output: {
            filename: 'web.bundle.js',
          },
          devtool:
            process.env.NODE_ENV === 'production'
              ? 'none'
              : 'inline-source-map',
        })
      )
      .pipe(dest(join(__dirname, './dist/')));
  },

  function webpackBuildForFrontend() {
    return src(join(__dirname, './src/server/index.ts'))
      .pipe(
        webpack({
          module: {
            rules: [
              {
                test: /\.[jt]sx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                  presets: [
                    '@babel/preset-env',
                    [
                      '@babel/preset-react',
                      {
                        runtime: 'automatic',
                        importSource: '@emotion/react',
                      },
                    ],
                    '@babel/preset-typescript',
                  ],
                  plugins: [
                    '@babel/plugin-transform-runtime',
                    '@emotion/babel-plugin',
                  ],
                },
              },
              {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
              },
            ],
          },
          resolve: {
            extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
            modules: [join(__dirname, './node_modules'), 'node_modules'],
          },
          resolveLoader: {
            modules: [join(__dirname, './node_modules'), 'node_modules'],
          },
          mode:
            process.env.NODE_ENV === 'development'
              ? 'development'
              : 'production',
          target: 'node',
          output: {
            filename: 'server.bundle.js',
          },
          devtool:
            process.env.NODE_ENV === 'production'
              ? 'none'
              : 'inline-source-map',
        })
      )
      .pipe(dest(join(__dirname, './dist/')));
  }
);

export function taskWatch() {
  watch(['src/**/*', 'base/**/*'], taskBuild);
}
