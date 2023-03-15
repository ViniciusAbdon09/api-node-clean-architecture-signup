import { Express } from 'express'
import { bodyPaser } from '../middlewares/body-parser'
import { cors } from '../middlewares/cors'

export default (app: Express) => {
  app.use(bodyPaser);
  app.use(cors);
}
