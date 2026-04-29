const formatNumber = (n) => n.toLocaleString();

const getMeta = (metaName) => {
  const metas = document.getElementsByTagName("meta");
  for (let i = 0; i < metas.length; i++) {
    if (
      metas[i].getAttribute("property") === metaName ||
      metas[i].getAttribute("name") === metaName
    ) {
      return metas[i].getAttribute("content");
    }
  }
  return "";
};

const tryAddLinks = () => {
  const firstNavLink = document.querySelector("[data-tab-item]");
  const ul = firstNavLink?.closest("ul");
  const existingLi = firstNavLink?.closest("li");
  const orgName = getMeta("profile:username");

  if (firstNavLink && ul && existingLi && orgName) {
    const addNavLink = (id, href, text) => {
      if (!document.getElementById(id)) {
        const li = document.createElement("li");
        li.id = id;
        li.className = existingLi.className;

        const a = document.createElement("a");
        a.className = firstNavLink.className;
        a.setAttribute("href", href);
        a.innerHTML = `<span data-component="text">${text}</span>`;

        li.appendChild(a);
        ul.appendChild(li);
      }
    };

    addNavLink(
      "org-issues-nav-item",
      `https://github.com/search?q=org%3A${orgName}+is%3Aissue&state=open&type=Issues`,
      "Issues",
    );

    addNavLink(
      "org-help-wanted-nav-item",
      `https://github.com/search?q=user%3A${orgName}+label%3A%22help+wanted%22&type=Issues&ref=advsearch&state=open&type=Issues`,
      "Help wanted",
    );

    fetch(
      `https://api.github.com/search/issues?q=org:${orgName}+state:open&per_page=1`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.total_count === "number") {
          const textSpan = document.querySelector(
            '#org-issues-nav-item [data-component="text"]',
          );
          if (textSpan) {
            textSpan.textContent = `Issues (${formatNumber(data.total_count)})`;
          }
        }
      })
      .catch(() => {
        // noop
      });

    return true;
  }

  return false;
};

let activeObserver = null;

const addOrgLinks = () => {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  if (tryAddLinks()) {
    // noop
  } else {
    activeObserver = new MutationObserver(() => {
      if (tryAddLinks()) {
        activeObserver.disconnect();
        activeObserver = null;
      }
    });
    activeObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      if (activeObserver) {
        activeObserver.disconnect();
        activeObserver = null;
      }
    }, 10000);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addOrgLinks);
} else {
  addOrgLinks();
}

document.addEventListener("turbo:load", addOrgLinks);
