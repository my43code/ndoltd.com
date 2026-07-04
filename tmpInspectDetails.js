const http = require('http');

const url = 'http://localhost:3000/updates';

const get = (url) => new Promise((resolve, reject) => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
  }).on('error', reject);
});

(async () => {
  try {
    const page = await get(url);
    const links = [...page.body.matchAll(/href=\"(\/updates\/[^"]+)\"/g)].map((m) => m[1]);
    console.log('LIST STATUS', page.statusCode);
    console.log('LINKS', links);

    for (const link of links) {
      const detail = await get('http://localhost:3000' + link);
      const titleMatch = detail.body.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'NO_TITLE';
      console.log('DETAIL', link, detail.statusCode, title);
    }
  } catch (err) {
    console.error(err);
  }
})();
