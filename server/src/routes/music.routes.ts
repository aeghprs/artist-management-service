import { Router } from "express";
import {
  verifyAuthorizationRole,
  verifyJWT,
} from "../middlewares/auth.middleware";
import { ROLE } from "./artist.routes";
import { validateRequest } from "../middlewares/validateRequest";
import { musicRegistrationSchema } from "../schemas/music.schema";
import MusicController from "../controller/music.controller";
import { validateQuery } from "../middlewares/validateQueryParams";
import { paginationQuerySchema } from "../schemas/artist.schema";

const router = Router();
const musicController = new MusicController();
router.use(verifyJWT);

router.post(
  "/artist/:artistId",
  verifyAuthorizationRole(ROLE.ARTIST),
  validateRequest(musicRegistrationSchema),
  musicController.registerMusic,
);

router.put(
  "/:id",
  verifyAuthorizationRole(ROLE.ARTIST),
  musicController.updateMusic,
);

router.delete(
  "/:id",
  verifyAuthorizationRole(ROLE.ARTIST),
  musicController.deleteMusic,
);

router.get(
  "/artist/:artistId",
  verifyAuthorizationRole(ROLE.SUPER_ADMIN, ROLE.ARTIST_MANAGER, ROLE.ARTIST),
  validateQuery(paginationQuerySchema),
  musicController.getSongsByArtist,
);

router.get(
  "/:id",
  verifyAuthorizationRole(ROLE.SUPER_ADMIN, ROLE.ARTIST_MANAGER, ROLE.ARTIST),
  musicController.getSong,
);

export default router;
