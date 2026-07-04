const http = require('http');
const urls = [
  'http://localhost:3000/updates/starlink-complete-overview',
  'http://localhost:3000/updates/6a3ae0628e04eb89c6735a81',
  'http://localhost:3000/updates/6a3705752a8eef750ce8dc4c',
  'http://localhost:3000/updates/6a34dec212c6f24351e7993d',
];
const get = (url) => new Promise((resolve, reject) => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
  }).on('error', reject);
});
(async () => {
  for (const url of urls) {
    const res = await get(url);
    console.log('URL', url, 'STATUS', res.statusCode);
    console.log('has company update', res.body.includes('Company update'));
    console.log('has fetching latest content', res.body.includes('Fetching the latest content'));
    console.log('has post title snippet', res.body.slice(0, 400).replace(/\n/g, ' '));
    console.log('---');
  }
})();
