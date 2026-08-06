import { Request, Response, NextFunction } from 'express';

const cacheStore = new Map<string, { value: any, expiry: number }>();

/**
 * A lightweight in-memory cache for high-frequency GET endpoints.
 * @param durationSeconds How long to cache the response.
 */
export const apiCache = (durationSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cached = cacheStore.get(key);

    if (cached && cached.expiry > Date.now()) {
      return res.status(200).json(cached.value);
    }

    // Proxy the res.json method to intercept the payload before sending
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Only cache successful requests
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          value: body,
          expiry: Date.now() + durationSeconds * 1000
        });
      }
      return originalJson(body);
    };

    next();
  };
};
