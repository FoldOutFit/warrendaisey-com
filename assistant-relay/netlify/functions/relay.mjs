/**
 * CORS relay for the daily assistant on warrendaisey.com.
 *
 * The browser cannot call the automation webhook directly: its preflight
 * sends no Access-Control-Allow-Origin. This function accepts that browser
 * POST and forwards the raw JSON body plus the Authorization header to one
 * hardcoded URL. It stores no secret and logs no header or body.
 */

const UPSTREAM = "https://api2.cursor.sh/automations/webhook/f6df5513-f225-5e72-b9dd-2a99de7179aa";
const ALLOWED_ORIGINS = new Set([
  "https://warrendaisey.com",
  "https://www.warrendaisey.com"
]);
const ALLOWED_REQUEST_HEADERS = ["authorization", "content-type", "accept"];
const MAX_BODY = 64 * 1024;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
    "Access-Control-Max-Age": "600",
    Vary: "Origin"
  };
}

function reply(status, origin, message) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (origin) Object.assign(headers, corsHeaders(origin));
  return new Response(JSON.stringify({ error: message }), { status, headers });
}

function allowedOrigin(req) {
  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return "";
  return origin;
}

function isJsonType(value) {
  const media = String(value || "").split(";")[0].trim().toLowerCase();
  return media === "application/json";
}

async function readBody(req) {
  if (!req.body) return new Uint8Array(0);
  const reader = req.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const step = await reader.read();
    if (step.done) break;
    total += step.value.byteLength;
    if (total > MAX_BODY) {
      await reader.cancel();
      return null;
    }
    chunks.push(step.value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

export default async function relay(req) {
  const origin = allowedOrigin(req);
  if (!origin) return reply(403, "", "origin");

  if (req.method === "OPTIONS") {
    const requested = String(req.headers.get("access-control-request-headers") || "")
      .split(",")
      .map(function (part) { return part.trim().toLowerCase(); })
      .filter(Boolean);
    for (const name of requested) {
      if (ALLOWED_REQUEST_HEADERS.indexOf(name) === -1) return reply(403, origin, "header");
    }
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") return reply(405, origin, "method");

  const authorization = req.headers.get("authorization");
  if (!authorization || /[\r\n]/.test(authorization)) return reply(401, origin, "authorization");
  if (!isJsonType(req.headers.get("content-type"))) return reply(415, origin, "content-type");

  const declared = Number(req.headers.get("content-length") || "0");
  if (Number.isFinite(declared) && declared > MAX_BODY) return reply(413, origin, "body");

  const body = await readBody(req);
  if (!body) return reply(413, origin, "body");
  if (body.byteLength === 0) return reply(400, origin, "body");

  try {
    JSON.parse(new TextDecoder().decode(body));
  } catch (err) {
    return reply(400, origin, "json");
  }

  let upstream;
  try {
    upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization
      },
      body: body,
      redirect: "manual"
    });
  } catch (err) {
    return reply(502, origin, "upstream");
  }

  const status = upstream.status;
  const headers = Object.assign({ "Cache-Control": "no-store" }, corsHeaders(origin));
  const type = upstream.headers.get("content-type");
  if (type) headers["Content-Type"] = type;
  if (status === 204 || status === 205 || status === 304) {
    return new Response(null, { status: status, headers: headers });
  }
  const upstreamBody = await upstream.arrayBuffer();
  return new Response(upstreamBody, { status: status, headers: headers });
}

export const config = {
  method: ["POST", "OPTIONS"]
};
