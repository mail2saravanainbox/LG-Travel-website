import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Module,
  UnauthorizedException,
} from "@nestjs/common";
import { verifyToken } from "@clerk/backend";

/**
 * Verifies a Clerk-issued session JWT sent as `Authorization: Bearer <token>`.
 * On success it attaches `{ userId, claims }` to the request as `req.auth`.
 *
 * Requires `CLERK_SECRET_KEY` in the environment. Get the frontend token with
 * Clerk's `getToken()` / `await auth().getToken()` and send it with the request.
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header: string = req.headers["authorization"] || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) throw new UnauthorizedException("Missing bearer token");

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new UnauthorizedException("Clerk is not configured (CLERK_SECRET_KEY missing)");
    }

    try {
      const claims = await verifyToken(token, {
        secretKey,
        // Lock tokens to your frontend origin(s) when set (defends against token reuse).
        authorizedParties: process.env.FRONTEND_URL?.split(","),
      });
      req.auth = { userId: claims.sub, claims };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired session token");
    }
  }
}

@Module({
  providers: [ClerkAuthGuard],
  exports: [ClerkAuthGuard],
})
export class ClerkAuthModule {}
