import * as throng from 'throng';
import {Application} from "express";

throng(require('os').cpus().length, workerID => {
  console.log(`Starting worker ${workerID}`);

  const app: Application = require('./app').app;

  app.listen(app.get('port'), () => {
    console.log(`Worker ${workerID} listening on port ${app.get('port')}`);
  });
});