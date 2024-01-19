import { Global, Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { CompaniesModule } from 'src/companies/companies.module';

@Global()
@Module({
  imports: [CompaniesModule],
  providers: [SocketsGateway],
  exports: [SocketsGateway]
})
export class SocketsModule {}
