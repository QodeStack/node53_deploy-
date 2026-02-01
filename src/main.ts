import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.useGlobalPipes(new ValidationPipe)
  app.useGlobalInterceptors(new LoggingInterceptor)
  app.useGlobalInterceptors(new ResponseSuccessInterceptor)

  const port = PORT ?? 3069;
  await app.listen(port, ()=>{
    console.log(`sever online atttttt : ${port}`);


  });
}
bootstrap();