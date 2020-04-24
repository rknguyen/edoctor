import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
import * as bodyParser from 'body-parser';
import cors from 'cors';

const rootDir = __dirname;

@ServerSettings({
  rootDir,
  acceptMimes: ['application/json'],
  httpPort: process.env.PORT || 8081,
  httpsPort: false,
  logger: {
    disableRoutesSummary: true,
  },
  mount: {
    '/api': [`${rootDir}/controllers/**/*.ts`],
  },
  componentsScan: [`${rootDir}/middlewares/**.ts`],
})
export class Server extends ServerLoader {
  constructor(settings: any) {
    super(settings);
  }

  $beforeRoutesInit(): void {
    this.use(GlobalAcceptMimesMiddleware)
      .use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true }))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));
  }
}
