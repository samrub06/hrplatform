import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from './casl/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  redirectToSwagger(@Res() res: Response) {
    return res.redirect('/swagger');
  }
}
