export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // ----- Admin API (KV) -----
    if (
      request.method === 'POST' &&
      ['gate', 'alert', 'event'].includes(url.pathname.slice(1))
    ) {
      const token = env.ADMIN_TOKEN;
      const auth  = request.headers.get('Authorization') || '';
      if (!token || auth !== `Bearer ${token}`) {
        return new Response('Unauthorized', { status: 401 });
      }

      try {
        const data = await request.json();
        const key = url.pathname.slice(1);
        await env.lacc_admin.put(key, JSON.stringify(data));
        return new Response('OK', { status: 200 });
      } catch (_) {
        return new Response('Bad Request', { status: 400 });
      }
    }

    // ----- Static file serving from R2 -----
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
