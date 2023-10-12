import express, { Application } from 'express';
import helmet from 'helmet';
import nocache from 'nocache';
import compression from 'compression';
import logger from 'morgan';
import cors from 'cors';
import env from 'dotenv';
import grpcServer from './src/interfaces/grpc-config/grpc-server';
import fdmReachedNodalAfterBooking from './src/application/events/consumer/cp-nodal-status-update';

class nodeApp {
  public app: Application

  constructor() {
    this.app = express()

    env.config()
    this.initialiseMiddleware()
    this.initiliseGatewayListner()
    this.messageConsumers()
  }

  private initialiseMiddleware(): void {
    this.app.use(cors())
    this.app.use(helmet());
    this.app.use(nocache())
    this.app.use(compression())
    this.app.use(logger('dev'))
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private initiliseGatewayListner() :void {
    grpcServer()
  }

  private messageConsumers () {
    fdmReachedNodalAfterBooking()
  }
  
  public listen(port: string): void {
    this.app.listen(port, () => console.log('consignmetn service is running at', port))
  }
}


export default nodeApp