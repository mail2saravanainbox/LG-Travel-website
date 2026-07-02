"use client";

import { useRouter } from "next/navigation";
import { useAdmin } from "@/store/admin";

/** Matches the raw error thrown by api.ts on a rejected/expired admin token. */
const AUTH_ERROR = /401|unauthor/i;

const EXPIRED_MSG =
  "Your session has expired — nothing was saved. Redirecting you to the login page…";

/**
 * Guard for admin write actions (create / update / delete).
 *
 * Every save handler used to begin with a bare `if (!token) return;`, which made
 * a missing session fail *silently*: the Save button appeared to work, but
 * nothing was sent and no message was shown. This centralises the check so a
 * dead session always surfaces a clear message and bounces the user to login.
 */
export function useAdminSession() {
  const router = useRouter();
  const token = useAdmin((s) => s.token);
  const logout = useAdmin((s) => s.logout);

  function endSession(onExpired: (msg: string) => void) {
    onExpired(EXPIRED_MSG);
    logout();
    // Leave the message on screen briefly so the user understands the redirect.
    setTimeout(() => router.replace("/admin/login"), 1500);
  }

  /**
   * Returns the token if the session is alive; otherwise shows `onExpired`,
   * clears the stale session, redirects to login and returns null so the caller
   * aborts. Never fails silently.
   */
  function requireToken(onExpired: (msg: string) => void): string | null {
    if (token) return token;
    endSession(onExpired);
    return null;
  }

  /**
   * Turn a caught save error into a user-facing message. Auth failures (an
   * invalidated token → 401) get the friendly session-expired treatment plus a
   * redirect; anything else is surfaced verbatim so the user sees what broke.
   */
  function reportError(err: unknown, onError: (msg: string) => void) {
    const msg = err instanceof Error ? err.message : String(err);
    if (AUTH_ERROR.test(msg)) {
      endSession(onError);
    } else {
      onError(msg);
    }
  }

  return { token, requireToken, reportError };
}
