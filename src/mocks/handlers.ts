import { http } from 'msw';

export const handlers = [
  http.post('/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;

    if (email === 'test@example.com' && password === 'password') {
      return new Response(JSON.stringify({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test_token',
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(null, {
        status: 401,
        statusText: 'Invalid credentials',
      });
    }
  }),
  http.post('/auth/register', async ({ request }) => {
    const { email, password, name } = await request.json() as any;

    if (email === 'test@example.com' && password === 'password' && name === 'Test User') {
      return new Response(JSON.stringify({
        user: { id: '2', name: 'Test User', email: 'test@example.com' },
        token: 'test_token_register',
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(null, {
        status: 400,
        statusText: 'Invalid registration data',
      });
    }
  }),
];
