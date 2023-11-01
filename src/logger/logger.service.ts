import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { loggerProps } from './logger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  error({message, stack, context}: loggerProps) {
    // add your tailored logic here
    super.error(message, stack, context);
  }
}