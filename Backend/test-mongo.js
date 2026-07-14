const mongoose = require('mongoose');
const Shipment = require('./src/models/Shipment');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/swiftex');
  
  const payload = {
    internalTrackingId: 'TEST-123',
    carrier: 'fedex',
    carrierTrackingNumber: '123456789',
    status: 'CREATED',
    legs: [],
    owner: new mongoose.Types.ObjectId(),
    metadata: {
      sender: { name: 'Sender Name', address: 'Sender Addr', phone: '123' },
      receiver: { name: 'Rec Name', address: 'Rec Addr', phone: '456' }
    }
  };
  
  const shipment = await Shipment.create(payload);
  console.log("Created:", JSON.stringify(shipment.toObject(), null, 2));
  
  const fetched = await Shipment.findOne({ internalTrackingId: 'TEST-123' }).lean();
  console.log("Fetched lean:", JSON.stringify(fetched, null, 2));
  
  await mongoose.disconnect();
}

test().catch(console.error);
