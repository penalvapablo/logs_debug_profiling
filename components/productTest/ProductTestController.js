const { Router } = require('express');
const router = new Router();
const productos = require('../../utils/generarProductos')
const logger = require('../../utils/winston')

module.exports = (app) =>{
  app.use('/api/productos-test', router)
  
  router.get('/', (req, res)=>{
    logger.log('info', `ruta /api/productos-test, metodo get`);
    
    res.json(productos)
  })
}