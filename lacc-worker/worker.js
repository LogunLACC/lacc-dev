export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let key = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    if (key.startsWith("/")) key = key.slice(1);

    const object = await env.STATIC.get(key);
    if (!object) return new Response("Not found", { status: 404 });

    const ext = key.split(".").pop();
    const mime = {
      html: "text/html;charset=utf-8",
      css:  "text/css",
      js:   "application/javascript",
      jpg:  "image/jpeg",
      jpeg: "image/jpeg",
      png:  "image/png",
      svg:  "image/svg+xml",
      mp4:  "video/mp4",
      webmanifest: "application/manifest+json",
      pdf:  "application/pdf"
    }[ext] || "application/octet-stream";

    return new Response(object.body, {
      headers: { "Content-Type": mime, "Cache-Control": "public,max-age=3600" }
    });
  }
};
