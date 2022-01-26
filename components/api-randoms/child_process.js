const numerosRandom = require('../../utils/numerosRandom');

process.on('message', (cant) => {
  let numeros = numerosRandom(cant)
  process.send({res: numeros});
});
