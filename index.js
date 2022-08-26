const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////
// Basic Server
////////////////////////////

// Read Templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// Read Data
const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productDataParsed = JSON.parse(productData);

const server = http.createServer((request, response) => {
  const { pathname, query } = url.parse(request.url, true);

  if (pathname === '/' || pathname === '/overview') {
    // Overview Page
    response.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = productDataParsed
      .map((product) => replaceTemplate(tempCard, product))
      .join('');
    const overviewHtml = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    response.end(overviewHtml);
  } else if (pathname === '/product') {
    // Product Page
    const product = productDataParsed.find((item) => item.id == query.id);
    const productHtml = replaceTemplate(tempProduct, product);
    response.end(productHtml);
  } else if (pathname === '/api') {
    // API
    response.writeHead(200, {
      'Content-type': 'application/json',
    });
    response.end(productData);
  } else {
    // Not Found
    response.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    response.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
