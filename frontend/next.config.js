// local backend
// const base = "http://127.0.0.1:5000";
// hosted backend
const base = "https://fromthearea-backend-e73b06909d2b.herokuapp.com";

module.exports = () => {
  const rewrites = () => {
    return [
      // {
      //   source: "/hello:path*",
      //   destination: base + "/api/hello:path*",
      // },
      // {
      //   source: "/queryBusinesses:path*",
      //   destination: base + "/api/queryBusinesses:path*",
      // },
      {
        source: "/login",
        destination: base + "/login/",
      },
      {
        source: "/:path*",
        destination: base + "/api/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};
