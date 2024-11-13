import { createParamDecorator, ExecutionContext } from "@nestjs/common";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserDocument } from "apps/auth/src/users/models/user.schema";

const getCurrentUserByContext = (ctx: ExecutionContext): UserDocument => {
    return ctx.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx)
);