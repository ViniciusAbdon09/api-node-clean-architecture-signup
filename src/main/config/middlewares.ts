import { Express } from 'express'
import { bodyPaser, cors, contentType } from '../middlewares'

export default (app: Express) => {
  app.use(bodyPaser);
  app.use(cors);
  app.use(contentType);
}
