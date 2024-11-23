import { fetchUsableData } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loadingCircle = document.querySelector("#loading-circle");

  const usableData = await fetchUsableData();

  if (!usableData) {
    console.error("usableData is not available");
    return;
  }
  const carouselContainer = document.querySelector(
    "#carousel .carousel-container"
  );
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
            <h3>${post.title.rendered}</h3>
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
});
