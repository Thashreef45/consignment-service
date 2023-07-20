import express, {Application} from 'express';
import helmet from 'helmet';
import nocache from 'nocache';
import compression from 'compression';
import logger from 'morgan';
import cors from 'cors';
import env from 'dotenv';
import route from './src/interfaces/routes';


class nodeApp{
  public app:Application

    constructor(){
      this.app = express()

      this.initialiseMiddleware()
      this.initialiseRoutes()
      env.config()
    }

    private initialiseMiddleware():void{
        this.app.use(cors())
        this.app.use(helmet());
        this.app.use(nocache())
        this.app.use(compression())
        this.app.use(logger('dev'))
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    private initialiseRoutes():void{
      this.app.use('/consignment',route)
    }
    
    public listen():void{
      this.app.listen(process.env.PORT,()=>console.log('consignmetn service is running at',process.env.PORT)) 
    }
}


export default nodeApp