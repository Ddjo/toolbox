import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../database/users/models/user.schema';

const getCurrentUserByContex = (ctx: ExecutionContext): UserDocument => {
  console.log('getCurrentUserByContex ctx', ctx)
  return ctx.switchToHttp().getRequest().user;
};
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContex(ctx),
);
