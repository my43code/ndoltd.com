const http = require('http');
const get = (url) => new Promise((resolve, reject) => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

(async () => {
  try {
    const html = await get('http://localhost:3000/updates');
    const cardRegex = /<a[^>]*href=\"(\/updates\/[^"]+)\"[^>]*>([\s\S]*?)<\/a>/g;
    const cards = [];
    let m;
    while ((m = cardRegex.exec(html))) {
      const href = m[1];
      const inner = m[2];
      const titleMatch = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : null;
      cards.push({ href, title, inner: inner.slice(0, 200).replace(/\s+/g, ' ').trim() });
    }
    console.log(JSON.stringify(cards, null, 2));
  } catch (err) {
    console.error(err);
  }
})();
