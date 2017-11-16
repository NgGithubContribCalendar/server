import {Application} from 'express';
import {cpus} from 'os';
import * as throng from 'throng';

throng(cpus().length, workerID => {
  console.log(`Starting worker ${workerID}`);

  const app: Application = require('./app').app; // tslint:disable-line:no-var-requires
  app.set('workerID', `Shard ${workerID.toLocaleString()}`);

  app.listen(app.get('port'), () => {
    console.log(`Worker ${workerID} listening on port ${app.get('port')}`);
  });
});
