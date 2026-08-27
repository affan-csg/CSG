import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { generateNonce, getSecurityHeaders } from "./lib/security-headers";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

declare global {
  var __CSP_NONCE__: string | undefined;
}

const PRODUCTION_HOSTNAMES = new Set(["careersourcegroup.com", "www.careersourcegroup.com"]);

import * as serverEntryModule from "@tanstack/react-start/server-entry";

async function getServerEntry(): Promise<ServerEntry> {
  return (serverEntryModule.default ?? serverEntryModule) as ServerEntry;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const nonce = generateNonce();
      // Store nonce in global for access during SSR (src/routes/__root.tsx reads it via globalThis.__CSP_NONCE__)
      globalThis.__CSP_NONCE__ = nonce;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);

      // Clear the global after render to avoid leaking across requests
      globalThis.__CSP_NONCE__ = undefined;
      const normalizedResponse = await normalizeCatastrophicSsrResponse(response);

      // Apply security headers to the response
      const securityHeaders = getSecurityHeaders(nonce);
      const headersToApply = new Headers(normalizedResponse.headers);

      for (const [key, value] of Object.entries(securityHeaders)) {
        headersToApply.set(key, value);
      }

      // Preview/non-production deployments (e.g. csg-v2.vercel.app) must never
      // compete with the production domain in search results. This header is
      // authoritative regardless of any per-page <meta name="robots"> tag.
      if (!PRODUCTION_HOSTNAMES.has(new URL(request.url).hostname)) {
        headersToApply.set("X-Robots-Tag", "noindex, nofollow");
      }

      // Inject nonce meta tag and add nonce attributes to executable script tags for CSP compliance
      let body = await normalizedResponse.clone().text();

      // Add nonce meta tag for client-side access
      if (body.includes("<head>")) {
        body = body.replace("<head>", `<head><meta name="csp-nonce" content="${nonce}" />`);
      }

      // Add nonce attribute to all script tags that don't already have one and aren't JSON-LD data
      body = body.replace(/<script([^>]*)>/g, (match) => {
        // Skip if already has nonce
        if (match.includes("nonce=")) return match;
        // Skip JSON-LD and JSON data scripts
        if (
          match.includes('type="application/ld+json"') ||
          match.includes("type='application/ld+json'") ||
          match.includes('type="application/json"') ||
          match.includes("type='application/json'")
        ) {
          return match;
        }
        // Add nonce to executable scripts
        return match.replace(">", ` nonce="${nonce}">`);
      });

      // Style tags render with whatever nonce React's SSR-time module state
      // happened to hold, which can be stale across requests (that module
      // state isn't request-scoped) - always overwrite/add the correct
      // per-request nonce here, same as scripts above.
      body = body.replace(/<style([^>]*)>/g, (match) => {
        if (match.includes("nonce=")) {
          return match.replace(/nonce="[^"]*"/, `nonce="${nonce}"`);
        }
        return match.replace(">", ` nonce="${nonce}">`);
      });

      return new Response(body, {
        status: normalizedResponse.status,
        statusText: normalizedResponse.statusText,
        headers: headersToApply,
      });
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
