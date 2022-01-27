const { Router } = require('express');
const router = new Router();
const { yargObj } = require('../../utils/yargs');
const numerosRandom = require('../../utils/numerosRandom');
const PORT = process.argv[2] || yargObj.port;
const logger = require('../../utils/winston')

const { fork } = require('child_process');
// const child_process = fork('./components/api-randoms/child_process.js');


module.exports = (app) => {
  app.use('/api/randoms', router);

  router.get('/', (req, res) => {
    logger.log('info', `ruta /api/randoms, metodo get`);
    let cant = req.query.cant || 100000000;
    let numeros = numerosRandom(cant)
    // child_process.send(cant);
    // child_process.on('message', (msj) => {
    //   res.send(msj.res);
    // });
    res.send(numeros)
  });
};
