const PROXY_CONFIG = [
  {
    context: [
      "/",
    ],
    target: "https://localhost:44312",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
