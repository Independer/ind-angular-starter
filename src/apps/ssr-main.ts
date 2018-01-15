import 'polyfills.server';
import { bootstrapServer } from 'shared-server';

import { AppServerModule as FirstModule } from './first/app/app.server.module';
import { AppServerModule as SecondModule } from './second/app/app.server.module';

export const first = bootstrapServer(FirstModule);
export const second = bootstrapServer(SecondModule);
