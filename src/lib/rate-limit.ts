import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

export function rateLimit(identifier: string): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { success: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return {
    success: true,
    remaining: MAX_REQUESTS - record.count,
    resetIn: record.resetTime - now,
  };
}

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `ip:${ip}`;
}

export function withRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  windowMs: number = WINDOW_MS,
  maxRequests: number = MAX_REQUESTS
) {
  return async function(request: NextRequest, context?: any) {
    const identifier = getClientIdentifier(request);
    const result = rateLimit(identifier);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please try again later.',
          retryAfter: Math.ceil(result.resetIn / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(result.resetIn / 1000).toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const response = await handler(request, context);

    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetIn.toString());

    return response;
  };
}
