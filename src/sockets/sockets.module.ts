import { Global, Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { CompaniesMembersModule } from 'src/companies-members/companies-members.module';

@Global()
@Module({
  imports: [CompaniesMembersModule],
  providers: [SocketsGateway],
  exports: [SocketsGateway]
})
export class SocketsModule {}
