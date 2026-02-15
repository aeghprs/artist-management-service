import { Router } from "express";
import ArtistController from "../controller/artist.controller";
import {
  verifyAuthorizationRole,
  verifyJWT,
} from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  artistRegistrationSchema,
  paginationQuerySchema,
} from "../schemas/artist.schema";
import { validateQuery } from "../middlewares/validateQueryParams";
import upload from "../middlewares/multer.upload";
import ArtistBatchController from "../controller/artistBatch.controller";
import { validateArtistCsv } from "../middlewares/validate.batchArtists";

const router = Router();
const artistController = new ArtistController();
const artistBatchController = new ArtistBatchController();

router.use(verifyJWT);

export const ROLE = {
  SUPER_ADMIN: "super_admin",
  ARTIST_MANAGER: "artist_manager",
  ARTIST: "artist",
} as const;
export type UserRole = (typeof ROLE)[keyof typeof ROLE];

router.get(
  "/",
  verifyAuthorizationRole(ROLE.SUPER_ADMIN, ROLE.ARTIST_MANAGER),
  validateQuery(paginationQuerySchema),
  artistController.getAllArtists,
);

router.get(
  "/export",
  verifyAuthorizationRole(ROLE.ARTIST_MANAGER),
  artistBatchController.exportCSV,
);

router.post(
  "/import",
  upload.single("file"),
  verifyAuthorizationRole(ROLE.ARTIST_MANAGER),
  validateArtistCsv,
  artistBatchController.importCSV,
);



router.get(
  "/:id",
  verifyAuthorizationRole(ROLE.SUPER_ADMIN, ROLE.ARTIST_MANAGER),
  artistController.getArtist,
);

router.post(
  "/new",
  verifyAuthorizationRole(ROLE.ARTIST_MANAGER),
  validateRequest(artistRegistrationSchema),
  artistController.registerArtist,
);

router.put(
  "/:id",
  verifyAuthorizationRole(ROLE.ARTIST_MANAGER),
  artistController.updateArtist,
);

router.delete(
  "/:id",
  verifyAuthorizationRole(ROLE.ARTIST_MANAGER),
  artistController.deleteArtist,
);

export default router;
