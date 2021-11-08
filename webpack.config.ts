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

    config.output!.libraryTarget = undefined;
    config.output!.library = {
      type: 'commonjs2'
    };

    (config.externals as Array<any>).push(
      { 'node:os': 'commonjs2 os' },
      { 'node.os': 'commonjs2 os' }
    );

    config.module!.rules!.push(
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
            'class-transformer/storage',
            'node:os'
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

    console.log(config);
  }

  return config;
}
