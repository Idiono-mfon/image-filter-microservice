import express, { Request, Response } from "express";
import cors from "cors";

import path from "path";

import { filterImageFromURL, deleteLocalFiles } from "./util/util";
// import { resolve } from "bluebird";

(async () => {
  // Init the Express application
  const app = express();

  // Set CORS middleware

  app.use(cors());

  // Set the network port
  const port = process.env.PORT || 8082;

  app.use(express.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredImage", async (req: Request, res: Response) => {
    try {
      const { image_url } = req.query;

      if (!image_url) return res.status(422).send("Image url is required");

      const fileExt: string = path.extname(image_url).slice(1) || "";

      const requiredExtesion: string[] = [
        "jpg",
        "png",
        "jpeg",
        "bmp",
        "tiff",
        "jiff",
      ];

      if (!requiredExtesion.includes(fileExt))
        return res.status(422).send("Invalid image");

      const filteredpath: string = await filterImageFromURL(image_url);

      return res.status(200).sendFile(filteredpath, async () => {
        await deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      return res.status(500).send("Ooops! error occurred please try again");
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
