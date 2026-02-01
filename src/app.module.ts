import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module-api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { ArticleModule } from './module-api/article/article.module';
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { DATABASE_REDIS } from './common/constant/app.constant';
import { APP_GUARD } from '@nestjs/core';
import { ProtectGuard } from './common/guard/protect.guard';
import { SearchAppModule } from './module-api/search-app/search-app.module';
import { ElasticSearchModule } from './modules-system/elastic-search/elastic-search.module';
import { OrderModule } from './module-api/order/order.module';
import { RabbitMQModule } from './modules-system/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    TokenModule,
    ArticleModule,
    CacheModule.register({  
      isGlobal: true,
      stores :[
        new KeyvRedis(DATABASE_REDIS),
      ]
    }),
    SearchAppModule,
    ElasticSearchModule,
    OrderModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
    provide: APP_GUARD,
    useClass: ProtectGuard,
  }
  ],
})
export class AppModule implements OnModuleInit {
  //import { Cache } from '@nestjs/cache-manager';
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache){}
  async onModuleInit() {
    try{
      await this.cacheManager.get("healthcheck")
      console.log("REDIS Cache Connected")
    }catch(err){
      console.log("REDIS Cache Failed") 
    }
  }
}