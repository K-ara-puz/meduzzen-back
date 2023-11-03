import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHandler {
  badRequest(errorMessage) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: errorMessage,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  notFoundException() {
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'element was not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
