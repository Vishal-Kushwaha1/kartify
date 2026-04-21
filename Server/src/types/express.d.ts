import type { User, UserSession } from "../utils/auth.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: UserSession;
    }
  }
}
