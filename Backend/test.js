const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/swiftex');
const Shipment = mongoose.model('Shipment', new mongoose.Schema({}, { strict: false }));
Shipment.find({ carrier: { $ne: 'swiftex' } }).then(docs => {
  console.log(JSON.stringify(docs, null, 2));
  process.exit(0);
});
