const productionUrl = "https://prestigious-bobcat-876.convex.cloud";
const isProd = process.env.CONVEX_CLOUD_URL === productionUrl;

export default {
  providers: [
    {
      domain: !isProd
        ? "https://stable-pangolin-28.clerk.accounts.dev"
        : "https://clerk.rechatai.com",
      applicationID: "convex",
    },
  ],
};
