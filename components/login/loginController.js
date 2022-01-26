const { Router } = require('express');
const router = new Router();

module.exports = (app) =>{
  app.use('/login', router)

  router.get('/', (req, res)=>{
    res.render('login')
  })
  
  router.post('/', (req, res) => {
  const name = req.body.name;
  if(!name || !name.length) {
    res.status(401).json({ error: 'No se envió un nombre para el Login' });
    return;
  }
  req.session.name = name;
  res.redirect('/');
});
}