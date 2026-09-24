import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const readline = createInterface({ input, output });
const password = process.env.ADMIN_PASSWORD || await readline.question('Admin password: ');
readline.close();
if (!password) throw new Error('A password is required.');
const iterations = 100000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const encode = (value) => value.toString('base64url');
console.log(`pbkdf2_sha256$${iterations}$${encode(salt)}$${encode(hash)}`);
