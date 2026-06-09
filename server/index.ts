import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";

// Setup
const app = express();
const port = 3000;
const saltRounds = 10;

// dotenv
env.config();

// The database connection
const db = new pg.Client({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});
db.connect();

// Enabling CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Data handling
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3,
    },
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Auth status check route
app.get("/auth/status", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
  });
});

// Handling the register post request
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.log("Error hashing the password:", err);
    } else {
      try {
        const entry = await db.query(
          "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
          [username, hash],
        );
        const user = entry.rows[0];
        req.login(user, (err) => {
          if (err) {
            console.log(err);

            return res.json({
              success: false,
              isAuthenticated: req.isAuthenticated(),
              error: "Login after registration failed.",
            });
          } else {
            return res.json({
              success: true,
              isAuthenticated: req.isAuthenticated(),
              successMsg: "Registration successful. You're now logged in!",
            });
          }
        });
      } catch (error) {
        console.log("Error registering user:", error);
        const errorMsg = "User already exists, try logging in.";

        return res.json({
          success: false,
          isAuthenticated: req.isAuthenticated(),
          error: errorMsg,
        });
      }
    }
  });
});

// Handling the login post request
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({
        success: false,
        error: info.message,
      });
    }

    if (user) {
      req.login(user, (err) => {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            isAuthenticated: req.isAuthenticated(),
            error: "Logging in failed.",
          });
        } else {
          return res.json({
            success: true,
            isAuthenticated: req.isAuthenticated(),
            successMsg: "You are now logged in!",
          });
        }
      });
    }
  })(req, res, next);
});

// Handling the logout post request
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        isAuthenticated: req.isAuthenticated(),
        error: "Error logging out.",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.json({
          success: false,
          isAuthenticated: req.isAuthenticated(),
          error: "Error destroying the session.",
        });
      }

      res.clearCookie("connect.sid");

      return res.json({
        success: true,
        isAuthenticated: req.isAuthenticated(),
        successMsg: "You have logged out!",
      });
    });
  });
});

// Handling adding a new show to the user's favorites
app.post("/favorites/add", async (req, res) => {
  const userId = req.user.id;

  try {
    const entry = await db.query(
      "INSERT INTO favorites (show_id, show_name, status, genres, rating, summary, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        req.body.showId,
        req.body.showName,
        req.body.status,
        req.body.genres,
        req.body.rating,
        req.body.summary,
        req.body.imageURL,
        req.user.id,
      ],
    );

    const newList = await db.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [userId],
    );
    const favoritesList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${req.body.showName} was added to your favorites!`,
      favoritesList: favoritesList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${req.body.showName} is already in your favorites.`,
    });
  }
});

// Handling the favorites list get request
app.get("/favorites/list", async (req, res) => {
  const userId = req.user.id;
  const result = await db.query(
    "SELECT * FROM favorites WHERE user_id = $1 ORDER BY show_name ASC",
    [userId],
  );

  if (result.rows.length > 0) {
    const favoritesList = result.rows;
    return res.json({
      success: true,
      favoritesList: favoritesList,
      successMsg: "Favorites list shown!",
    });
  } else {
    return res.json({
      success: false,
      error: "You don't have any shows in your favorites yet!",
    });
  }
});

// Handling removing a show from the favorites list
app.post("/favorites/remove", async (req, res) => {
  const userId = req.user.id;
  const showId = req.body.showId;
  const showName = req.body.showName;

  try {
    const removal = await db.query(
      "DELETE FROM favorites WHERE show_id = $1 AND user_id = $2",
      [showId, userId],
    );
    const newList = await db.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [userId],
    );
    const favoritesList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${showName} was removed from your favorites!`,
      favoritesList: favoritesList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${showName} was already removed from your favorites!`,
    });
  }
});

// Handling adding a new show to the user's watched list
app.post("/watched/add", async (req, res) => {
  const userId = req.user.id;

  try {
    const entry = await db.query(
      "INSERT INTO watched (show_id, show_name, status, genres, rating, summary, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        req.body.showId,
        req.body.showName,
        req.body.status,
        req.body.genres,
        req.body.rating,
        req.body.summary,
        req.body.imageURL,
        req.user.id,
      ],
    );

    const newList = await db.query("SELECT * FROM watched WHERE user_id = $1", [
      userId,
    ]);
    const watchedList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${req.body.showName} was added to your watched list!`,
      watchedList: watchedList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${req.body.showName} is already in your watched list.`,
    });
  }
});

// Handling the watched list get request
app.get("/watched/list", async (req, res) => {
  const userId = req.user.id;
  const result = await db.query(
    "SELECT * FROM watched WHERE user_id = $1 ORDER BY show_name ASC",
    [userId],
  );

  if (result.rows.length > 0) {
    const watchedList = result.rows;
    return res.json({
      success: true,
      watchedList: watchedList,
      successMsg: "Watched list shown!",
    });
  } else {
    return res.json({
      success: false,
      error: "You don't have any shows in your watched list yet.",
    });
  }
});

// Handling removing a show from the watched list
app.post("/watched/remove", async (req, res) => {
  const userId = req.user.id;
  const showId = req.body.showId;
  const showName = req.body.showName;

  try {
    const removal = await db.query(
      "DELETE FROM watched WHERE show_id = $1 AND user_id = $2",
      [showId, userId],
    );
    const newList = await db.query("SELECT * FROM watched WHERE user_id = $1", [
      userId,
    ]);
    const watchedList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${showName} was removed from your watched list!`,
      watchedList: watchedList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${showName} was already removed from your watched list!`,
    });
  }
});

// Handling adding a new show to the user's watching list
app.post("/watching/add", async (req, res) => {
  const userId = req.user.id;

  try {
    const entry = await db.query(
      "INSERT INTO watching (show_id, show_name, status, genres, rating, summary, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        req.body.showId,
        req.body.showName,
        req.body.status,
        req.body.genres,
        req.body.rating,
        req.body.summary,
        req.body.imageURL,
        req.user.id,
      ],
    );

    const newList = await db.query(
      "SELECT * FROM watching WHERE user_id = $1",
      [userId],
    );
    const watchingList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${req.body.showName} was added to your watching list!`,
      watchingList: watchingList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${req.body.showName} is already in your watching list.`,
    });
  }
});

// Handling the watching list get request
app.get("/watching/list", async (req, res) => {
  const userId = req.user.id;
  const result = await db.query(
    "SELECT * FROM watching WHERE user_id = $1 ORDER BY show_name ASC",
    [userId],
  );

  if (result.rows.length > 0) {
    const watchingList = result.rows;
    return res.json({
      success: true,
      watchingList: watchingList,
      successMsg: "watching list shown!",
    });
  } else {
    return res.json({
      success: false,
      error: "You don't have any shows in your watching list yet.",
    });
  }
});

// Handling removing a show from the watching list
app.post("/watching/remove", async (req, res) => {
  const userId = req.user.id;
  const showId = req.body.showId;
  const showName = req.body.showName;

  try {
    const removal = await db.query(
      "DELETE FROM watching WHERE show_id = $1 AND user_id = $2",
      [showId, userId],
    );
    const newList = await db.query(
      "SELECT * FROM watching WHERE user_id = $1",
      [userId],
    );
    const watchingList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${showName} was removed from your watching list!`,
      watchingList: watchingList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${showName} was already removed from your watching list!`,
    });
  }
});

// Handling adding a new show to the user's watchlist
app.post("/watchlist/add", async (req, res) => {
  const userId = req.user.id;

  try {
    const entry = await db.query(
      "INSERT INTO watchlist (show_id, show_name, status, genres, rating, summary, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        req.body.showId,
        req.body.showName,
        req.body.status,
        req.body.genres,
        req.body.rating,
        req.body.summary,
        req.body.imageURL,
        req.user.id,
      ],
    );

    const newList = await db.query(
      "SELECT * FROM watchlist WHERE user_id = $1",
      [userId],
    );
    const watchlistList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${req.body.showName} was added to your watchlist!`,
      watchlistList: watchlistList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${req.body.showName} is already in your watchlist.`,
    });
  }
});

// Handling the watchlist get request
app.get("/watchlist/list", async (req, res) => {
  const userId = req.user.id;
  const result = await db.query(
    "SELECT * FROM watchlist WHERE user_id = $1 ORDER BY show_name ASC",
    [userId],
  );

  if (result.rows.length > 0) {
    const watchlistList = result.rows;
    return res.json({
      success: true,
      watchlistList: watchlistList,
      successMsg: "watchlist shown!",
    });
  } else {
    return res.json({
      success: false,
      error: "You don't have any shows in your watchlist yet.",
    });
  }
});

// Handling removing a show from the watchlist
app.post("/watchlist/remove", async (req, res) => {
  const userId = req.user.id;
  const showId = req.body.showId;
  const showName = req.body.showName;

  try {
    const removal = await db.query(
      "DELETE FROM watchlist WHERE show_id = $1 AND user_id = $2",
      [showId, userId],
    );
    const newList = await db.query(
      "SELECT * FROM watchlist WHERE user_id = $1",
      [userId],
    );
    const watchlistList = newList.rows;

    return res.json({
      success: true,
      successMsg: `${showName} was removed from your watchlist!`,
      watchlistList: watchlistList,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: `${showName} was already removed from your watchlist!`,
    });
  }
});

// Passport local strategy
passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      bcrypt.compare(password, storedPassword, (err, result) => {
        if (err) {
          return cb(err);
        } else {
          if (result) {
            return cb(null, user);
          } else {
            return cb(null, false, {
              message: "Incorrect password, please try again.",
            });
          }
        }
      });
    } else {
      return cb(null, false, {
        message: "User not found, please register first.",
      });
    }
  }),
);

// Saving the user info in the session
passport.serializeUser((user, cb) => {
  cb(null, user);
});

// Retrieves the saved user data when needed
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Backend server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
