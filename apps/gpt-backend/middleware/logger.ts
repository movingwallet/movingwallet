import { Request, Response, NextFunction } from 'express';
import LogModel from '../models/Log';

export async function registrarLogAutomatico(req: Request, res: Response, next: NextFunction) {
  try {
    // Ignoramos ciertos endpoints triviales o de salud
    if (req.path === '/api/ping') return next();

    await LogModel.create({
      tipo: 'HTTP',
      origen: req.method + ' ' + req.path,
      descripcion: `Acceso a ${req.method} ${req.originalUrl}`,
      payload: {
        body: req.body,
        query: req.query,
        headers: {
          'user-agent': req.headers['user-agent'],
          referer: req.headers['referer']
        }
      }
    });
  } catch (err) {
    console.warn('⚠️ Error registrando log automático:', err);
  }

  next();
}
