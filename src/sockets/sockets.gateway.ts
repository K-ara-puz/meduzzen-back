import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CompaniesService } from 'src/companies/companies.service';

const configService = new ConfigService();

@WebSocketGateway({
  cors: {
    origin: configService.get('SOCKET_ORIGIN'),
  },
})
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly companyService: CompaniesService) {}
  handleAddQuizInCompany(
    companyId: string,
    companyName: string,
    quizName: string,
  ) {
    this.server.to(companyId).emit('add_quiz', {
      quizName,
      companyName,
      fromServer: 'new quiz was added',
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    this.server.emit('message', { yourMessage: data, fromServer: 'ok' });
  }

  @SubscribeMessage('join_companies_rooms')
  async handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    let companiesRoomsIds = [];
    const { detail: companies } =
      await this.companyService.getCompaniesWhereIMember(
        { page: 1, limit: 5000 },
        userId,
      );
    companies.items.forEach((element) => {
      companiesRoomsIds.push(element.company.id);
    });
    client.join(companiesRoomsIds);
  }
}
