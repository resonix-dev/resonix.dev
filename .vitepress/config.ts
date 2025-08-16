import {
  defineConfig,
  resolveSiteDataByRoute,
  type HeadConfig,
} from "vitepress";
import { groupIconMdPlugin } from "vitepress-plugin-group-icons";

const prod = !!process.env.NETLIFY;

export default async function () {
  const api_url = "https://api.github.com/repos/resonix-dev/resonix-node";
  const latest_version = await fetch(`${api_url}/releases/latest`)
    .then((res) => res.json())
    .then((data) => data.tag_name);

  // Site configuration (see https://vitepress.dev/reference/site-config )
  return defineConfig({
    rewrites: {
      "en/:rest*": ":rest*",
    },
    title: "Resonix",
    description: "High-performance audio node",
    lang: "en-US",
    lastUpdated: true,
    cleanUrls: true,
    sitemap: { hostname: "https://resonix.dev" },
    appearance: false,
    markdown: {
      lineNumbers: true,
      config(md) {
        const fence = md.renderer.rules.fence!;
        md.renderer.rules.fence = function (tokens, idx, options, env, self) {
          const locale = (env as any).locale || "en";
          const isGerman = locale === "de";
          const codeCopyButtonTitle = isGerman ? "Code kopieren" : "Copy code";
          return fence(tokens, idx, options, env, self).replace(
            '<button title="Copy Code" class="copy"></button>',
            `<button title="${codeCopyButtonTitle}" class="copy"></button>`,
          );
        };
        md.use(groupIconMdPlugin);
      },
    },
    head: [
      [
        "link",
        {
          rel: "icon",
          type: "image/png",
          href: "https://resonix.dev/logo.png",
        },
      ],
      ["meta", { name: "theme-color", content: "#ff914d" }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:site_name", content: "Resonix" }],
      [
        "meta",
        {
          property: "og:image",
          content: "https://resonix.dev/og.png",
        },
      ],
      ["meta", { property: "og:url", content: "https://resonix.dev/" }],
      [
        "script",
        {},
        `try{
         localStorage.setItem('vitepress-theme-appearance','dark');
         document.documentElement.classList.add('dark');
       }catch(e){}`,
      ],
    ],
    themeConfig: {
      logo: "https://resonix.dev/logo.png",
      editLink: {
        pattern: "https://github.com/resonix-dev/docs/blob/development/:path",
        text: "Edit this page on GitHub",
      },
      socialLinks: [{ icon: "github", link: "https://github.com/resonix-dev" }],
      footer: {
        message: "Released under the BSD-3-Clause License.",
        copyright: "Copyright © 2025-present Resonix OSS contributors",
      },
      search: { provider: "local" },
    },
    locales: {
      root: {
        label: "English",
        lang: "en-US",
        title: "Resonix",
        description: "High-performance audio node",
        themeConfig: {
          nav: [
            {
              text: "Guide",
              link: "/guide/",
              activeMatch: "/guide/",
            },
            {
              text: "Client",
              link: "/guide/client/overview",
              activeMatch: "/guide/client/",
            },
            { text: "API", link: "/api/reference", activeMatch: "/api/" },
            { text: "Config", link: "/guide/configuration" },
            {
              text: latest_version,
              items: [
                {
                  text: "Changelog",
                  link: "https://github.com/resonix-dev/resonix-node/blob/master/CHANGELOG.md",
                },
                {
                  text: "Contribution Guide",
                  link: "https://github.com/resonix-dev/resonix-node/blob/master/CONTRIBUTING.md",
                },
              ],
            },
          ],
          sidebar: {
            "/guide/": [
              {
                text: "Overview",
                link: "/guide/",
              },
              {
                text: "Audio Node (Server)",
                collapsed: false,
                items: [
                  { text: "Introduction", link: "/guide/introduction" },
                  { text: "Installation", link: "/guide/installation" },
                  { text: "Configuration", link: "/guide/configuration" },
                  { text: "Resolver & Sources", link: "/guide/resolver" },
                  { text: "Architecture", link: "/guide/architecture" },
                  { text: "Deployment", link: "/guide/deployment" },
                  { text: "Security", link: "/guide/security" },
                  { text: "Troubleshooting", link: "/guide/troubleshooting" },
                ],
              },
              {
                text: "Client (resonix.js)",
                collapsed: false,
                items: [
                  { text: "Overview", link: "/guide/client/overview" },
                  { text: "Installation", link: "/guide/client/installation" },
                  { text: "Usage & Examples", link: "/guide/client/usage" },
                  { text: "API", link: "/guide/client/api" },
                  {
                    text: "Troubleshooting",
                    link: "/guide/client/troubleshooting",
                  },
                  { text: "Roadmap", link: "/guide/client/roadmap" },
                ],
              },
            ],
            "/api/": [
              {
                text: "REST & WebSocket",
                items: [
                  { text: "Overview", link: "/api/reference" },
                  { text: "Authentication", link: "/api/authentication" },
                  { text: "Endpoints", link: "/api/endpoints" },
                  { text: "WebSocket Stream", link: "/api/websocket" },
                ],
              },
            ],
          },
        },
      },
      de: {
        label: "Deutsch",
        lang: "de-DE",
        title: "Resonix",
        description: "Hochleistungs Audio Node",
        themeConfig: {
          nav: [
            {
              text: "Anleitung",
              link: "/de/guide/",
              activeMatch: "/de/guide/",
            },
            {
              text: "Client",
              link: "/de/guide/client/overview",
              activeMatch: "/de/guide/client/",
            },
            { text: "API", link: "/de/api/reference", activeMatch: "/de/api/" },
            { text: "Konfiguration", link: "/de/guide/configuration" },
            {
              text: latest_version,
              items: [
                {
                  text: "Änderungsprotokoll",
                  link: "https://github.com/resonix-dev/resonix-node/blob/master/CHANGELOG.md",
                },
                {
                  text: "Beitragsleitfaden",
                  link: "https://github.com/resonix-dev/resonix-node/blob/master/CONTRIBUTING.md",
                },
              ],
            },
          ],
          sidebar: {
            "/de/guide/": [
              {
                text: "Übersicht",
                link: "/de/guide/",
              },
              {
                text: "Audio Node (Server)",
                collapsed: false,
                items: [
                  { text: "Einführung", link: "/de/guide/introduction" },
                  { text: "Installation", link: "/de/guide/installation" },
                  { text: "Konfiguration", link: "/de/guide/configuration" },
                  { text: "Resolver & Quellen", link: "/de/guide/resolver" },
                  { text: "Architektur", link: "/de/guide/architecture" },
                  { text: "Bereitstellung", link: "/de/guide/deployment" },
                  { text: "Sicherheit", link: "/de/guide/security" },
                  { text: "Fehlerbehebung", link: "/de/guide/troubleshooting" },
                ],
              },
              {
                text: "Client (resonix.js)",
                collapsed: false,
                items: [
                  { text: "Überblick", link: "/de/guide/client/overview" },
                  {
                    text: "Installation",
                    link: "/de/guide/client/installation",
                  },
                  {
                    text: "Nutzung & Beispiele",
                    link: "/de/guide/client/usage",
                  },
                  { text: "API", link: "/de/guide/client/api" },
                  {
                    text: "Fehlerbehebung",
                    link: "/de/guide/client/troubleshooting",
                  },
                  { text: "Roadmap", link: "/de/guide/client/roadmap" },
                ],
              },
            ],
            "/de/api/": [
              {
                text: "REST & WebSocket",
                items: [
                  { text: "Übersicht", link: "/de/api/reference" },
                  { text: "Authentifizierung", link: "/de/api/authentication" },
                  { text: "Endpoints", link: "/de/api/endpoints" },
                  { text: "WebSocket Stream", link: "/de/api/websocket" },
                ],
              },
            ],
          },
        },
      },
    },
    transformPageData: prod
      ? (pageData, ctx) => {
          const site = resolveSiteDataByRoute(
            ctx.siteConfig.site,
            pageData.relativePath,
          );
          const title = `${pageData.title || site.title} | ${pageData.description || site.description}`;
          ((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
            ["meta", { property: "og:locale", content: site.lang }],
            ["meta", { property: "og:title", content: title }],
          );
        }
      : undefined,
  });
}
