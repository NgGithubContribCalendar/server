import * as express from 'express';
import {Application} from 'express';
import {ControllerLoader} from "express-decorated-router/dist";
import {RootController} from "./Controller";

export const app: Application = <any>express();
app.disable('etag');
app.disable('x-powered-by');
app.set('env', 'production');
app.set('port', parseInt(process.env.PORT || '5000'));

new ControllerLoader(app).loadController(RootController);

