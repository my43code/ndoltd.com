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
  try {
    for (const url of urls) {
      const detail = await get(url);
      console.log('URL', url, 'STATUS', detail.statusCode);
      const h1Matches = [...detail.body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].trim());
      console.log('H1 matches', h1Matches);
      const mainIndex = detail.body.indexOf('<main');
      const mainClose = detail.body.indexOf('</main>', mainIndex);
      console.log('MAIN CONTENT', mainIndex >= 0 && mainClose > mainIndex ? detail.body.slice(mainIndex, mainClose + 7).slice(0, 800) : 'NO_MAIN');
      console.log('----');
    }
  } catch (err) {
    console.error(err);
  }
})();
