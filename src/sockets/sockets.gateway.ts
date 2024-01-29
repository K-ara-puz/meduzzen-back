import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CompaniesMembersService } from '../companies-members/companies-members.service';

const configService = new ConfigService();

@WebSocketGateway({
  cors: {
    origin: configService.get('SOCKET_ORIGIN'),
  },
})
export class SocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly companyMembersService: CompaniesMembersService,
  ) {}
  async handleAddQuizInCompany(
    initiatorUserId: string,
    companyId: string,
    companyName: string,
    quizName: string,
  ): Promise<void> {
    const { detail: members } =
      await this.companyMembersService.getCompanyMembers(
        { page: 1, limit: 5000 },
        companyId,
      );
    members.items.forEach((member) => {
      if (member.user.id === initiatorUserId) return;
      this.server.to(member.user.id).emit('add_quiz', {
        quizName,
        companyName,
        fromServer: 'new quiz was added',
      });
    });
  }

  async handleUserCanPassQuizNotify(
    userId: string,
    text: string,
  ): Promise<void> {
    this.server.to(userId).emit('user_can_pass_quiz', {
      text,
      fromServer: 'You already can pass this quiz',
    });
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: string): Promise<void> {
    this.server.emit('message', { yourMessage: data, fromServer: 'ok' });
  }

  @SubscribeMessage('join_user_room')
  async handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.join(userId);
  }
}
