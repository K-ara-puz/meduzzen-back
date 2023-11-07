import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'; 
import { Response } from 'express'; 
 
@Catch(HttpException) 
export class HttpExceptionFilter<T> implements ExceptionFilter { 
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); 
    const response = ctx.getResponse<Response>(); 
    const status = exception.getStatus();
    console.log('pppppppppppp')
 
    response 
      .status(status) 
      .json({ 
        status_code: status, 
        detail: {"error": exception.message}, 
        result: exception.message, 
      }); 
  } 
}