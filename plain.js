const express = require("express");
const fetch = require("node-fetch");
const querystring = require("querystring");

const { clientId, clientSecret } = require("./keys");

const CORS_ORIGIN = "http://localhost:8080";

app = express();

console.log(__dirname);

function getGoogleAuthUrl() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${CORS_ORIGIN}/auth/google/callback`,
    client_id: clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
}

async function getToken(code, clientId, clientSecret, redirectUri) {
  //   let tokinfo;
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  let finalUrl = `${url}?${querystring.stringify(values)}`;

  const resp = await fetch(finalUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return resp.json();
}

//* * routes
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/pubic" });
});

app.get("/auth/google/", (req, res) => {
  let gurl = getGoogleAuthUrl();
  console.log("getting token: ", gurl);
  res.redirect(gurl);
});

app.get("/auth/google/callback", async (req, res) => {
  let recvToken;
  console.log("callback called");
  let code = req.query.code;
  recvToken = await getToken(
    code,
    clientId,
    clientSecret,
    `${CORS_ORIGIN}/auth/google/callback`
  );
  console.log("token is set working now");
  console.log("token recv: ", recvToken);
  res.send(recvToken);
});

app.listen(8080);
