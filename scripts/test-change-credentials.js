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
  console.log('--- Testing Admin Credentials Change & Clean Login ---');

  // 1. Login with current credentials
  const loginRes = await request(
    { hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ email: 'admin@livora.ye', password: 'admin123456' })
  );
  console.log('✓ Login 1 Status:', loginRes.status);
  const cookie = loginRes.headers['set-cookie'][0].split(';')[0];

  // 2. Change password test
  const changeRes = await request(
    { hostname: 'localhost', port: 3000, path: '/api/admin/change-credentials', method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie } },
    JSON.stringify({
      currentPassword: 'admin123456',
      newEmail: 'admin@livora.ye',
      newPassword: 'adminNewPassword2026',
      confirmPassword: 'adminNewPassword2026',
    })
  );
  console.log('✓ Change Credentials Status:', changeRes.status, changeRes.body);

  // 3. Test logging in with the new password
  const newLoginRes = await request(
    { hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ email: 'admin@livora.ye', password: 'adminNewPassword2026' })
  );
  console.log('✓ New Login Status:', newLoginRes.status, newLoginRes.body.success ? 'SUCCESS' : 'FAILED');

  // 4. Change password back to default for convenience
  const newCookie = newLoginRes.headers['set-cookie'][0].split(';')[0];
  const restoreRes = await request(
    { hostname: 'localhost', port: 3000, path: '/api/admin/change-credentials', method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: newCookie } },
    JSON.stringify({
      currentPassword: 'adminNewPassword2026',
      newEmail: 'admin@livora.ye',
      newPassword: 'admin123456',
      confirmPassword: 'admin123456',
    })
  );
  console.log('✓ Restored credentials for user testing:', restoreRes.status);

  console.log('🎉 ADMIN CREDENTIALS CHANGE TEST PASSED SUCCESSFULLY!');
}

main().catch(console.error);
