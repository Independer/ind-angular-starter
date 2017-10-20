import 'zone.js/dist/zone-node';
import 'polyfills.server';
import { AppServerModuleNgFactory } from '../../../aot_temp/src/apps/second/app/app.server.module.ngfactory';
import { bootstrapServer } from 'shared-server';

// tslint:disable-next-line:no-default-export
export default bootstrapServer(AppServerModuleNgFactory);
