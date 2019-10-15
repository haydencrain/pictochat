import { ForbiddenError } from "../exceptions/forbidden-error";
import { UserRepo } from "../repositories/user-repo";

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
