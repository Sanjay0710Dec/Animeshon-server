import { Router } from "express";
import {
  advancedAnimeSearch,
  basicAnimeSearch,
} from "@/controllers/anime/search.controller";
import animeInfo from "../controllers/anime/animeInfo";
import popularAnime from "@/controllers/anime/popularAnime";
import recentAnimeEpisodes from "@/controllers/anime/recentAnime";
import trendingAnime from "@/controllers/anime/trendingAnime";
import randomAnime from "@/controllers/anime/randomAnime";
import animeByGenres from "@/controllers/anime/animeByGenre";
import top10Anime from "@/controllers/anime/top10Anime";
import top10AnimeInfo from "@/controllers/anime/top10AnimeInfo";

const searchRouter = Router();

searchRouter.route("/search/:query").get(basicAnimeSearch);
searchRouter.route("/filter").get(advancedAnimeSearch);
searchRouter.route("/info/:animeId").get(animeInfo);
searchRouter.route("/popular").get(popularAnime);
searchRouter.route("/recent-anime-episodes").get(recentAnimeEpisodes);
searchRouter.route("/trending").get(trendingAnime);
searchRouter.route("/randomAnime").get(randomAnime);
searchRouter.route("/genre").get(animeByGenres);
searchRouter.route("/top10-anime").get(top10Anime);
searchRouter.route("/top10Animeinfo/:top10InfoId").get(top10AnimeInfo);

export default searchRouter;

