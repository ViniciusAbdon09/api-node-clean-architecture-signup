import { Express } from 'express'
import { bodyPaser } from '../middlewares/body-parser'
import { contentType } from '../middlewares/content-type';
import { cors } from '../middlewares/cors'

export default (app: Express) => {
  app.use(bodyPaser);
  app.use(cors);
  app.use(contentType);
}
