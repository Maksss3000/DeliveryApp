const PROXY_CONFIG = [
  {
    context: [
      "/api",
    ],
    target: "https://localhost:44312",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
