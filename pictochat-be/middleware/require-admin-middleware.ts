import { ForbiddenError } from "../exceptions/forbidden-error";
import { UserRepo } from "../repositories/user-repo";

/**
 * Stops request from being processed if user is not an admin
 */
export async function requireAdminMiddleware(req, res, next) {
  try {
    const userId = req.user.userId;
    const requestingUser = await UserRepo.getUser(userId);

    if (!requestingUser.hasAdminRole) {
      throw new ForbiddenError();
    }

    next();
  } catch (error) {
    next(error);
  }
}
