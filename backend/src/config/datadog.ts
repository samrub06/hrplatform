import tracer from 'dd-trace';

tracer.init({
  service: 'hr-platform',
  env: process.env.NODE_ENV || 'development',
  logInjection: true,
});

export default tracer; 