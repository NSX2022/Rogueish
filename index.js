import fs from 'fs';

const data = await fs.promises.readFile('token.txt', 'utf8');
const token = data.split('\n')[0].trim();
//console.log(token);
