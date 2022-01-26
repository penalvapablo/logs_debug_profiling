const socket = io();

const productForm = document.querySelector('#productForm');
const productTitleInput = document.querySelector('#title');
const productPriceInput = document.querySelector('#price');
const productThumbnailInput = document.querySelector('#thumbnail');
const productsTable = document.querySelector('#productsList');

const chatForm = document.querySelector('.chat-form');
const compressionTitle = document.querySelector('.compression');
const chatMessageInput = chatForm.querySelector('[name="message"]');
const chatEmailInput = chatForm.querySelector('[name="email"]');
const chatNombreInput = chatForm.querySelector('[name="nombre"]');
const chatApellidoInput = chatForm.querySelector('[name="apellido"]');
const chatEdadInput = chatForm.querySelector('[name="edad"]');
const chatAliasInput = chatForm.querySelector('[name="alias"]');
const chatAvatarInput = chatForm.querySelector('[name="avatar"]');
const messagesView = document.querySelector('.chat-messages');

const productTemplate = Handlebars.compile(`
  {{#if productsExists}}
    <div class="bg-dark">
      <div class="row border-bottom">
        <div class="col-4 p-4 fw-bold">Nombre</div>
        <div class="col-4 p-4 fw-bold">Precio</div>
        <div class="col-4 p-4 fw-bold">Foto</div>
      </div>
      {{#each products}}
      <div class="row border-bottom">
        <div class="col-4 p-4">{{this.title}}</div>
        <div class="col-4 p-4">{{this.price}}</div>
        <div class="col-4 p-4">
          <img width="50" src="{{this.thumbnail}}" />
        </div>
      </div>
      {{/each}}
    </div>
  {{else}}
    <div class="alert alert-warning fw-bold" role="alert"> No se encontraron productos</div>
  {{/if}}
`);

const messagesTemplate = Handlebars.compile(`
  {{#if messagesExists}}
    {{#each messages}}
      <div class="message-item">
        <span class="author">{{this.author.email}}</span>
        <span>
          [<span class="date">{{this.fecha}}</span>]:
        </span>
        <span class="message">{{this.text}}</span>
      </div>
    {{/each}}
  {{/if}}
`);

const messageTemplate = Handlebars.compile(`
  <div class="message-item">
    <span class="author">{{author.email}}</span>
    <span>
      [<span class="date">{{fecha}}</span>]:
    </span>
    <span class="message">{{text}}</span>
  </div>
`);

const author = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
const text = new normalizr.schema.Entity('text', { author: author },{ idAttribute: 'id' });
const messagesCenter = new normalizr.schema.Entity('messagesCenter', {
  authors: [author],
  messages: [text]
}, { idAttribute: 'id' });



function renderMessages(messages = null) {
  const normalizedLength = JSON.stringify(messages).length;
  const data = normalizr.denormalize(messages.result, messagesCenter, messages.entities);
  const denormalizedLength = JSON.stringify(data).length;
  const messagesToDisplay = data.messages;
  const html = messagesTemplate({messages: messagesToDisplay, messagesExists: !!messagesToDisplay.length});
  messagesView.innerHTML = html;
  messagesView.scrollTop = messagesView.scrollHeight;
  compressionTitle.innerHTML = `(Compresión: ${Math.floor(100 * normalizedLength / denormalizedLength)}%)`;
}

function renderMessage(message) {
  const html = messageTemplate({...message});
  messagesView.insertAdjacentHTML('beforeend', html);
  messagesView.scrollTop = messagesView.scrollHeight;
}

// socket.on('products', renderProducts);

socket.on('messages', renderMessages);
socket.on('message', renderMessage);

// productForm.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const title = productTitleInput.value;
//   const price = productPriceInput.value;
//   const thumbnail = productThumbnailInput.value;
//   socket.emit('productAdd', { title, price, thumbnail });
//   productForm.reset();
// });

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = {
    author: {
      email: chatEmailInput.value,
      nombre: chatNombreInput.value,
      apellido: chatApellidoInput.value,
      edad: chatEdadInput.value,
      alias: chatAliasInput.value,
      avatar: chatAvatarInput.value,
    },
    text: chatMessageInput.value,
  };
  socket.emit('message', message);
  chatMessageInput.value = '';
});

// ------ API PRODUCTS TEST
const api_url = `http://localhost:8080/api/productos-test`;
let products;
async function getProductsTest() {
  const res = await fetch(api_url);
  const data = await res.json();
  products = await data.products;
  renderProducts(products);
}

function renderProducts(products = []) {
  const html = productTemplate({
    products,
    productsExists: products.length,
  });
  productsTable.innerHTML = html;
}

getProductsTest();
// API PRODUCTS TEST -----------
