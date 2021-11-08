import { Configuration, IgnorePlugin } from 'webpack';
import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';

export default (
  config: Configuration,
  _options: CustomWebpackBrowserSchema,
  targetOptions: TargetOptions
) => {
  if (targetOptions.target === 'server') {
    config.target = 'node';
    config.externalsPresets = { node: true };
    config.resolve!.extensions!.push('.mjs')

    config.module!.rules!.push(
      {
        test: /\.m?js$/,
        use: 'babel-loader',
        include: /node_modules/,
        type: 'javascript/auto',
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                modules: true
              }
            ]
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-transform-modules-commonjs'
          ]
        }
      },
      {
        test: /\.node$/,
        loader: 'node-loader'
      }
    );

    config.plugins!.push(
      new IgnorePlugin({
        checkResource: (resource, string) => {
          const lazyImpots = [
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
            'apollo-server-fastify',
            'react',
            'ts-morph',
            'supertest',
            'formidable',
            'class-transformer/storage'
          ];

          if(!lazyImpots.includes(resource)) {
            return false;
          }

          try {
            require.resolve(resource);
          } catch (_err: any) {
            return true;
          }

          return false;
        }
      })
    );
  }
}
