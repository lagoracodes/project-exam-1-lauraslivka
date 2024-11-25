import { fetchUsableData } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loadingCircle = document.querySelector("#loading-circle");

  const usableData = await fetchUsableData();

  // FEATURED POSTS
  if (!usableData) {
    console.error("usableData is not available");
    return;
  }
  const carouselContainer = document.querySelector(".carousel-container");
  const leftArrow = document.querySelector(".btn-arrow.mirror");
  const rightArrow = document.querySelector(".btn-arrow:not(.mirror)");

  if (!Array.isArray(usableData) || usableData.length === 0) {
    carouselContainer.innerHTML = "<p>No data available.</p>";
    return;
  }

  try {
    loadingCircle.remove();
    const featuredPosts = usableData.filter((post) => {
      const content = post.content?.rendered || "";
      return (
        content.toLowerCase().includes("featured") &&
        content.toLowerCase().includes("yes")
      );
    });

    if (featuredPosts.length === 0) {
      carouselContainer.innerHTML = "<p>No featured posts available.</p>";
      return;
    }

    let currentIndex = 0;

    const renderPost = (index) => {
      const post = featuredPosts[index];
      const imageUrl =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
      const postHTML = `
        <div class="carousel-item">
          <a href="/recipes-detailed.html?id=${post.id}">
            <img src="${imageUrl}" alt="${post.title.rendered}" />
            <h4>${post.title.rendered}</h4>
          </a>
        </div>
      `;
      carouselContainer.innerHTML = postHTML;
    };

    renderPost(currentIndex);

    leftArrow.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 1 + featuredPosts.length) % featuredPosts.length;
      renderPost(currentIndex);
    });

    rightArrow.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % featuredPosts.length;
      renderPost(currentIndex);
    });
  } catch (error) {
    carouselContainer.innerHTML = "<p>Error loading featured posts.</p>";
  }

  // NEWEST POSTS
  const newestPostsSection = document.querySelector("#newest-posts");

  try {
    const newestPosts = usableData.slice(0, 3);

    const renderNewestPostsSection = () => {
      const titleHTML = `
        <div id="newest-posts-titles" class="f-fd-row f-ai-center">
          <h5>newest posts</h5>
          <a href="/recipes.html">show more</a>
        </div>
      `;

      const postsHTML = newestPosts
        .map((post) => {
          const imageUrl =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
          return `
            <div class="newest-post-item">
              <a href="/recipes-detailed.html?id=${post.id}">
                <img src="${imageUrl}" alt="${post.title.rendered}" />
                <h4>${post.title.rendered}</h4>
              </a>
            </div>
          `;
        })
        .join("");

      newestPostsSection.innerHTML =
        titleHTML + `<div class="f-fd-row">${postsHTML}</div>`;
    };

    renderNewestPostsSection();
    loadingCircle.remove();
  } catch (error) {
    newestPostsSection.innerHTML = "<p>Error loading newest posts.</p>";
    loadingCircle.remove();
  }
});
