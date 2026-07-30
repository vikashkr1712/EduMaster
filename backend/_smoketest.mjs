process.env.NODE_ENV = 'development';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/edumaster_test';
process.env.JWT_ACCESS_SECRET = 'a'.repeat(40);
process.env.JWT_REFRESH_SECRET = 'b'.repeat(40);
process.env.CLIENT_URL = 'http://localhost:5173';

const app = (await import('./src/app.js')).default;
const server = app.listen(0);
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

const hit = async (name, path, opts = {}) => {
  const res = await fetch(base + path, opts);
  let body;
  try { body = await res.json(); } catch { body = '<non-json>'; }
  const short = { success: body.success, message: body.message, errors: body.errors };
  console.log(`${name}\n  -> ${res.status} ${JSON.stringify(short)}`);
};

await hit('health', '/api/v1/health');
await hit('404 unknown route', '/api/v1/does-not-exist');
await hit('register: empty body', '/api/v1/auth/register', {
  method: 'POST', headers: {'Content-Type':'application/json'}, body: '{}' });
await hit('register: bad email + weak pw + mismatch', '/api/v1/auth/register', {
  method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ name:'Al', email:'nope', password:'short', confirmPassword:'other' }) });
await hit('register: injected role field (strict)', '/api/v1/auth/register', {
  method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ name:'Ann Lee', email:'a@b.com', password:'passw0rd1', confirmPassword:'passw0rd1', role:'admin' }) });
await hit('me: no token', '/api/v1/auth/me');
await hit('me: garbage token', '/api/v1/auth/me', { headers: { Authorization: 'Bearer not.a.jwt' } });
await hit('profile: no token', '/api/v1/users/profile');
await hit('logout: no token', '/api/v1/auth/logout', { method: 'POST' });

server.close();
