const { google } = require("googleapis");
const express = require("express");
const fetch = require("node-fetch");

const { clientId, clientSecret } = require("./keys");
app = express();

const oauthClient = new google.auth.OAuth2(
  clientId,
  clientSecret,
  "http://192.168.1.192:8080/auth/google/callback"
);

function getGoogleAuthUrl() {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  return oauthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
}

async function getAuthToken(code) {
  const { tokens } = await oauthClient.getToken(code);
  console.log(tokens);
  return tokens;
}

async function getUserInfo(tokens) {
  console.log("getting user");
  let resp = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
    {
      headers: {
        Authorization: `Bearer ${tokens.id_token}`,
      },
    }
  );

  googleUser = await resp.json();
  console.log("user: ", googleUser);
  return googleUser;
}
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/pubic" });
});

app.get("/auth/google/", (req, res) => {
  res.redirect(getGoogleAuthUrl());
});

app.get("/auth/google/callback", async (req, res) => {
  let code = req.query.code;
  token = await getAuthToken(code);
  console.log("between toek nadn user");
  console.log(token);
  user = await getUserInfo(token);

  return res.send(user);
});

app.listen(8080);
