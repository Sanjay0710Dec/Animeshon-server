import { Router } from "express";
import { animeEpisodes, animeEpisodeStreamingLinks } from "@/controllers/anime/stream.controller";

const streamRouter = Router();

streamRouter.route('/episodes').get(animeEpisodes);
streamRouter.route('/watchEpisode').get(animeEpisodeStreamingLinks);

export default streamRouter;