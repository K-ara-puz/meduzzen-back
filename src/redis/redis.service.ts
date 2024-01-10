import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { QuizResult } from 'src/entities/quizResult.entity';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { RedisConstants } from 'src/utils/constants';

@Global()
@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private redisClient: Redis,
    private configService: ConfigService,
  ) {}

  async setQuizResult(
    data: Partial<QuizResult>,
    id: string,
  ): Promise<generalResponse<string>> {
    try {
      const key = `${RedisConstants.quizResultKey}:${id}`;
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(data)],
          ['expire', key, this.configService.get('REDIS_QUIZ_RESULT_DURATION')],
        ])
        .exec();
      return {
        status_code: HttpStatus.OK,
        detail: 'ok',
        result: 'company quizzes',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
