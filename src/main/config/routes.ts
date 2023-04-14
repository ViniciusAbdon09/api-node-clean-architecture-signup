import { Express, Router } from 'express'
import { readdirSync } from 'fs';

export const setupRoutes = (app: Express) => {
  const router = Router();
  app.use('/api', router);

  // importando os arquivos de rota dinamicamente
  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
