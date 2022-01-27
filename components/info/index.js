const { Router } = require('express');
const router = new Router();
const yarg = require('yargs');
const numCPUs = require('os').cpus().length;
const getArguments = require('../../utils/getTerminalArguments');
const logger = require('../../utils/winston');

const data = yarg(process.argv.slice(2)).argv;

const info = {
  argumentosDeEntrada: getArguments(data),
  nombreDeLaPlataforma: process.platform,
  versionDeNode: process.version,
  rss: process.memoryUsage().rss,
  pathDeEjecucion: process.title,
  processId: process.pid,
  carpetaDelProyecto: process.cwd(),
  cantidadDeProcesadores: numCPUs,
};

module.exports = (app) => {
  app.use('/info', router);

  router.get('/', (req, res) => {
    // logger.log('info', `ruta /info, metodo get`);
    console.log(info);
    res.render('info', { info });
  });
};
