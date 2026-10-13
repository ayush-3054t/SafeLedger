import { http, HttpResponse, delay } from 'msw';

export const mockUserData = {
  id: 'usr_7f8a9b1c',
  name: 'Alex Johnson',
  email: 'admin@bank.com',
  role: 'admin',
  createdAt: '2025-01-01T00:00:00.00Z',
};

export const mockAuthSuccess = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl83ZjhhOWIxYyJ9.sample_jwt_signature',
  user: mockUserData,
};

export const handlers = [
  // Authentication Login Handler
  http.post('*/auth/login', async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;

    // Simulate Network/Processing latency (configurable)
    await delay(30);

    // Rate Limiting Mock check
    if (email === 'ratelimited@bank.com') {
      return HttpResponse.json(
        { message: 'Too many requests. Please try again later in 15 minutes.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    // Timeout / Gateway error trigger
    if (email === 'timeout@bank.com') {
      await delay(200);
      return HttpResponse.json(
        { message: 'Gateway Timeout. The upstream server failed to respond in time.' },
        { status: 504 }
      );
    }

    // Server internal failure trigger
    if (email === 'servererror@bank.com') {
      return HttpResponse.json(
        { message: 'Internal Server Error. Please contact support.' },
        { status: 500 }
      );
    }

    // Credential check
    if (email === 'admin@bank.com' && password === 'Admin123') {
      return HttpResponse.json(mockAuthSuccess, { status: 200 });
    }

    // Default: Invalid credentials
    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }),

  // Pre-warm ping mock
  http.get('*/ping', () => {
    return HttpResponse.json({ status: 'alive' });
  }),
];
