export const RABBITMQ_QUEUES = {
  USER_REGISTRATION: 'user_registration',
  USER_NOTIFICATION: 'user_notification',
  EMAIL_NOTIFICATION: 'email_notification',
  JOB_CREATED: 'job_created',
  JOB_UPDATED: 'job_updated',
};

export const RABBITMQ_EXCHANGES = {
  USER_EVENTS: 'user_events',
  JOB_EVENTS: 'job_events',
};

export const RABBITMQ_ROUTING_KEYS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  JOB_CREATED: 'job.created',
  JOB_UPDATED: 'job.updated',
};
