export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        success: true,
        app: "GODIA PRIME CONNECT",
        message: "Backend is working"
      });
    }

    return env.ASSETS.fetch(request);
  }
};
