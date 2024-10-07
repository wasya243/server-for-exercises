const mongoose = require('mongoose');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeUUID(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function generateInvoice() {
  const descriptionLength = getRandomInt(10, 20);
  const amount = getRandomInt(1, 10000);

  return {
    amount,
    description: makeUUID(descriptionLength),
  }
}

function generateInvoices(amount = 0) {
  const invoices = [];

  for(let i = 0; i < amount; i++) {
    invoices.push(generateInvoice());
  }

  return invoices;
}

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/exercise-3-8');
    const invoices = generateInvoices(100);

    await mongoose.connection.collection('invoices').insertMany(invoices);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

run();