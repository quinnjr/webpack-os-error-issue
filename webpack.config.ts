import { Configuration, IgnorePlugin } from 'webpack';
import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import { WebpackConfigDumpPlugin } from 'webpack-config-dump-plugin';

export default (
  config: Configuration,
  _options: CustomWebpackBrowserSchema,
  targetOptions: TargetOptions
) => {
  if (targetOptions.target === 'server') {
    config.target = 'node';
    config.externalsPresets = { node: true };
    config.resolve!.extensions!.push('.mjs');

    (config.externals as Array<any>).push({ 'node:os' : {} });

    config.module!.rules!.push(
      {
        test: /\.node$/,
        loader: 'node-loader'
      }
    );

    config.plugins!.push(
      new WebpackConfigDumpPlugin(),
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

  console.log(config.externals);

  return config;
}
