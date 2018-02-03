import * as express from 'express';
import {ExpressDecoratedRouter} from 'express-decorated-router';
import './Controller';
import {Numerics} from './utils/Numerics';

export const app: express.Application = <any>express();
app.disable('etag');
app.disable('x-powered-by');
app.set('env', 'production');
app.set('port', parseInt(process.env.PORT || Numerics.DEFAULT_PORT, Numerics.RADIX));

ExpressDecoratedRouter.applyRoutes(app).reset();
