import Bee from 'bee-queue';

// eslint-disable-next-line import/no-named-as-default-member
import NotificationEmail from '../app/jobs/NotificationEmail';
import CancelationEmail from '../app/jobs/CancelationEmail';
import redisConfig from '../config/redis';

const jobs = [NotificationEmail, CancelationEmail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  proccessQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}`, err);
  }
}

export default new Queue();
