import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { loggerProps } from './logger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  toLog({message, stack, context}: loggerProps) {
    super.log(message, stack, context);
  }
  error({message, stack, context}: loggerProps) {
    // add your tailored logic here
    super.error(message, stack, context);
  }

  fatal({message, stack, context}: loggerProps) {
    super.fatal(message, stack, context);
  }

  warn({message, stack, context}: loggerProps) {
    super.warn(message, stack, context);
  }

  debug({message, stack, context}: loggerProps) {
    super.debug(message, stack, context);
  }

  verbose({message, stack, context}: loggerProps) {
    super.verbose(message, stack, context);
  }
}