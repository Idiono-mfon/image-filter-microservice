import express from "express";
import cors from "cors";

import path from "path";

import fs from "fs";
// import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set CORS middleware

  app.use(cors());

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  // app.use(bodyParser.json());

  app.use(express.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredImage", async (req, res) => {
    try {
      const { image_url } = req.query;

      if (!image_url) return res.status(422).send("Image url is required");

      const fileExt: string = path.extname(image_url).slice(1) || "";

      const requiredExtesion = ["jpg", "png", "jpeg", "bmp", "tiff", "jiff"];

      if (!requiredExtesion.includes(fileExt))
        return res.status(422).send("Invalid image");

      const filteredpath = await filterImageFromURL(image_url);

      const ext = path.extname(filteredpath);

      res.setHeader("Content-Type", `image/${ext.slice(1)}`);

      const fileStream = fs
        .createReadStream(path.resolve(filteredpath))
        .pipe(res);

      fileStream.end(async () => {
        await deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      return res.status(500).send("Ooops! error occurred please try again");
    }
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
