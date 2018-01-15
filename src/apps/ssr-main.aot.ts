import 'polyfills.server';
import { bootstrapServer } from 'shared-server';

import { AppServerModuleNgFactory as FirstModule } from '../../aot_temp/src/apps/first/app/app.server.module.ngfactory';
import { AppServerModuleNgFactory as SecondModule } from '../../aot_temp/src/apps/second/app/app.server.module.ngfactory';

export const first = bootstrapServer(FirstModule);
export const second = bootstrapServer(SecondModule);
