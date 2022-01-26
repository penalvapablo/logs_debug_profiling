const faker = require('faker')
faker.locale = 'es'


const products = []
for(let i=0; i < 5; i++){
  const newProduct = {
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnail: faker.image.image(),
  }
  products.push(newProduct)
}

module.exports =  {products}