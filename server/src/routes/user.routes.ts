import { Router } from "express";
import {
  verifyAuthorizationRole,
  verifyJWT,
} from "../middlewares/auth.middleware";
import { validateQuery } from "../middlewares/validateQueryParams";
import { paginationQuerySchema } from "../schemas/artist.schema";
import UserController from "../controller/user.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { userRegistrationSchema } from "../schemas/auth.schemas";

const router = Router();
const userController = new UserController();

router.use(verifyJWT);

export const ROLE = {
  SUPER_ADMIN: "super_admin",
  ARTIST_MANAGER: "artist_manager",
  ARTIST: "artist",
} as const;
export type UserRole = (typeof ROLE)[keyof typeof ROLE];

router.get(
  "/getUsersForArtist",
  verifyAuthorizationRole(ROLE.SUPER_ADMIN, ROLE.ARTIST_MANAGER),
  userController.getUserWithArtistRole,
);

router.use(verifyAuthorizationRole(ROLE.SUPER_ADMIN));

router.get(
  "/",
  validateQuery(paginationQuerySchema),
  userController.getAllUsers,
);

router.get("/:id", userController.getUserById);

router.post(
  "/new",
  validateRequest(userRegistrationSchema),
  userController.registerUser,
);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export default router;
