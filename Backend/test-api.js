require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');
const config = require('./src/config');

const token = jwt.sign({ _id: '667a42bbbc37299a4cbe2340', role: 'admin' }, config.jwtSecret);

const data = JSON.stringify({
  carrier: "fedex",
  carrierTrackingNumber: "770732801861",
  metadata: {
    sender: { name: "External Sender Test", address: "Sender Address", phone: "123" },
    receiver: { name: "External Receiver Test", address: "Receiver Address", phone: "456" }
  }
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/shipments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(res.statusCode);
    console.log(body);
  });
});

req.on('error', console.error);
req.write(data);
req.end();
