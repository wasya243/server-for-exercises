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

function randomDate(start, end) {
  const date = new Date(+start + Math.random() * (end - start));

  return date;
}

function generateEmail() {
  const emailNameLength = getRandomInt(4, 7);
  return `${makeUUID(emailNameLength)}@gmail.com`;
}

function generateUser() {
  const firstNameLength = getRandomInt(4, 8);
  const lastNameLength = getRandomInt(4, 8);
  const salary = getRandomInt(1500, 8000);
  const birthdate = randomDate(new Date('01-01-1970'), new Date('01-01-1997'));

  return {
    firstName: makeUUID(firstNameLength),
    lastName: makeUUID(lastNameLength),
    email: generateEmail(),
    salary,
    birthdate,
  }
}

function generateUsers(amount = 0) {
  const users = [];

  for(let i = 0; i < amount; i++) {
    users.push(generateUser());
  }

  return users;
}

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/exercise-3-8');
    const users = generateUsers(100);

    await mongoose.connection.collection('users').insertMany(users);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

run();