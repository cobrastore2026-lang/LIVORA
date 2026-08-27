const fs = require('fs');
const path = require('path');

const dir = process.cwd();
console.log('process.cwd():', dir);
console.log('join(dir, "app"):', path.join(dir, 'app'), 'exists:', fs.existsSync(path.join(dir, 'app')));
console.log('join(dir, "pages"):', path.join(dir, 'pages'), 'exists:', fs.existsSync(path.join(dir, 'pages')));
console.log('join(dir, "src", "app"):', path.join(dir, 'src', 'app'), 'exists:', fs.existsSync(path.join(dir, 'src', 'app')));
console.log('join(dir, "src", "pages"):', path.join(dir, 'src', 'pages'), 'exists:', fs.existsSync(path.join(dir, 'src', 'pages')));

console.log('\nReading src directory:');
try {
  console.log(fs.readdirSync(path.join(dir, 'src')));
} catch (e) {
  console.error(e);
}
