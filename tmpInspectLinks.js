const http = require('http');
const urls = ['http://localhost:3000/updates'];

const get = (url) => new Promise((resolve, reject) => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
  }).on('error', reject);
});

(async () => {
  try {
    const page = await get(urls[0]);
    console.log('LIST STATUS', page.statusCode);
    const links = [...page.body.matchAll(/href=\"(\/updates\/[^"]+)\"/g)].map((m) => m[1]);
    console.log('LINKS', links);
    for (const link of links.slice(0, 5)) {
      const detail = await get('http://localhost:3000' + link);
      console.log('DETAIL', link, detail.statusCode, detail.body.slice(0, 400));
    }
  } catch (err) {
    console.error(err);
  }
})();
