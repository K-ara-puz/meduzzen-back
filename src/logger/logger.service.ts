import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { loggerProps } from '../interfaces/Logger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  toLog({ message, stack, context }: loggerProps) {
    super.log(message);
  }
  error({ message, stack, context }: loggerProps) {
    super.error(message);
  }

  fatal({ message, stack, context }: loggerProps) {
    super.fatal(message);
  }

  warn({ message, stack, context }: loggerProps) {
    super.warn(message);
  }

  debug({ message, stack, context }: loggerProps) {
    super.debug(message);
  }

  verbose({ message, stack, context }: loggerProps) {
    super.verbose(message);
  }
}
