import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  executeActionEach2mn(action: () => Promise<any>) {
    //Deletes the current timeout
    if (this.schedulerRegistry.doesExist('interval', 'execute-action')) {
      this.schedulerRegistry.deleteInterval('execute-action');
    }

    function handleActionExceptions() {
      action().catch((error) => console.log(error));
    }
    //timeout of 2mn
    const interval = setInterval(handleActionExceptions, 120 * 1000);
    //const interval = setInterval(action, 120 * 1000);
    this.schedulerRegistry.addInterval('execute-action', interval);
  }

  resetValueIn24h() {
    //Deletes the current timeout if existing.
    if (this.schedulerRegistry.doesExist('timeout', 'reset-value')) {
      const action = this.schedulerRegistry.getTimeout('reset-value');
      this.schedulerRegistry.deleteTimeout('reset-value');
      const timeout = setTimeout(() => action, 24 * 60 * 60 * 1000);
      this.schedulerRegistry.addTimeout('reset-value', timeout);
    }
  }

  setActionIn24h(action: () => void) {
    //Deletes the current timeout if existing.
    if (this.schedulerRegistry.doesExist('timeout', 'reset-value')) {
      this.schedulerRegistry.deleteTimeout('reset-value');
    }
    //timeout of 24h
    const timeout = setTimeout(action, 24 * 60 * 60 * 1000);
    //const timeout = setTimeout(action, 24 * 60 * 60 * 1000);
    this.schedulerRegistry.addTimeout('reset-value', timeout);
  }
}
