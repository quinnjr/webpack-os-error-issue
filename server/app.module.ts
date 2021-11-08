import { join } from 'path';
import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { AppServerModule } from '../src/main.server';

import { User } from '@prisma/client';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/webpack-os-error-issue/browser')
    })
  ]
})
export class AppModule {}
