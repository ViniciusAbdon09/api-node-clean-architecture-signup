import { Express } from 'express'
import { bodyPaser } from '../middlewares/body-parser'

export default (app: Express) => {
  app.use(bodyPaser)
}
