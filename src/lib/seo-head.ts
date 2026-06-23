const BASE = "https://webforge-quest.lovable.app";

export function pageHead(path: string, title: string, description: string) {
  const url = `${BASE}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}