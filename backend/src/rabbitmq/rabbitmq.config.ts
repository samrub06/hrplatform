export const RABBITMQ_QUEUES = {
  USER_NOTIFICATION: 'user_notification_queue',
  JOB_NOTIFICATION: 'job_notification_queue',
  CV_MATCHING: 'cv_matching_queue',
} as const;

export const RABBITMQ_ROUTING_KEYS = {
  USER_CREATED: 'user.created',
  JOB_CREATED: 'job.created',
  CV_EXTRACTED: 'cv.extracted',
  JOB_MATCHED: 'job.matched',
} as const;

export const RABBITMQ_EXCHANGES = {
  USER_EVENTS: 'user_events',
  JOB_EVENTS: 'job_events',
  CV_EVENTS: 'cv_events',
} as const;
