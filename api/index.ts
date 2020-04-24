import { $log, ServerLoader } from '@tsed/common';
import { Server } from './server';

require('./db');

async function bootstrap() {
  try {
    const server = await ServerLoader.bootstrap(Server, {});
    await server.listen();
  } catch (err) {
    $log.error(err);
  }
}

bootstrap();
