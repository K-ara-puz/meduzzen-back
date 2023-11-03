import { Module } from '@nestjs/common';
import { ErrorHandler } from './errorHandler.service';

@Module({
  providers: [ErrorHandler],
  exports: [ErrorHandler],
})
export class ErrorHandlerModule {}
