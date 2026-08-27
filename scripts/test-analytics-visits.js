const http = require('http');

async function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('--- Testing Visitor Tracking & Reset Stats ---');

  // 1. Send 2 page views
  await request(
    { hostname: 'localhost', port: 3000, path: '/api/analytics/track', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ path: '/', referrer: '' })
  );
  await request(
    { hostname: 'localhost', port: 3000, path: '/api/analytics/track', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ path: '/products', referrer: 'http://localhost:3000/' })
  );
  console.log('✓ Simulated 2 storefront visits');

  // 2. Admin Login
  const loginRes = await request(
    { hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ email: 'admin@livora.ye', password: 'admin123456' })
  );
  const cookie = loginRes.headers['set-cookie'][0].split(';')[0];
  console.log('✓ Admin authenticated');

  // 3. Fetch Analytics
  const analyticsRes = await request(
    { hostname: 'localhost', port: 3000, path: '/api/admin/analytics', method: 'GET', headers: { Cookie: cookie } }
  );

  console.log('Analytics Response Stats:');
  console.log(JSON.stringify(analyticsRes.body.stats, null, 2));

  if (
    analyticsRes.body.stats.totalSales === 0 &&
    analyticsRes.body.stats.totalOrders === 0 &&
    analyticsRes.body.stats.visits.today >= 2
  ) {
    console.log('🎉 VISITOR TRACKING & ZEROED STATS TEST PASSED SUCCESSFULLY!');
  } else {
    throw new Error('Test failed: unexpected stats');
  }
}

main().catch(console.error);
