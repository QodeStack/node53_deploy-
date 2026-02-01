import { Global, Inject, Module, OnModuleInit } from "@nestjs/common";
import {ClientProxy, ClientsModule,Transport} from "@nestjs/microservices"
import { RABBIT_MQ_URL } from "src/common/constant/app.constant";


@Global()
@Module({
    imports: [
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBIT_MQ_URL!],
          queue: 'order_queue',
          queueOptions: {
            durable: false // restart rabbitmq  sẽ bị mất 
          },
          socketOptions:{
            connectionOptions : {
                clientProperties:{
                    connection_name:'order-send'
                }
            }
          }
        },
      },
    ]),
  ],
    exports :[
      ClientsModule,
    ]
})
export class RabbitMQModule implements OnModuleInit{
    constructor(@Inject("ORDER_SERVICE") private client:ClientProxy) {}

    async onModuleInit() {
      // kiểm tra kết nối 
      try{
        await this.client.connect(); 
          console.log("RABBIT-MQ Connected");
      }catch(err){
          console.log("RABBIT-MQ failed",err);
      }
    }
}