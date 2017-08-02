import 'zone.js/dist/zone-node';
import './polyfills.server';
import { AppServerModuleNgFactory } from '../aot_temp/src/app/app.server.module.ngfactory';
import { bootstrapServer } from './bootsrap-server';

// tslint:disable-next-line:no-default-export
export default bootstrapServer(AppServerModuleNgFactory);
