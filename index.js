import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Static files
app.use(express.static("public"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

// Rendering the home page.
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Handling the search request and the redirection to a page with the URL of the query.
app.post("/search", (req, res) => {
  const query = req.body.selection;
  res.redirect("/series/" + encodeURIComponent(query));
});

// Receiving the redirection, search request, calling the API and sending back the result from the API.
app.get("/series/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const response = await axios.get(
      "https://api.tvmaze.com/singlesearch/shows?q=" + name,
    );
    const result = response.data;
    res.render("series.ejs", {
      series: name,
      showName: result.name,
      status: result.status,
      genres: result.genres,
      rating: result.rating.average,
      summary: result.summary,
      imageURL: result.image.original,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).render("index.ejs", {
      error: "Show not found!",
    });
  }
});
