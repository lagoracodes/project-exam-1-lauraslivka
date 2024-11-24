import { fetchUsableData } from "./api.js";

const recipeGrid = document.getElementById("recipe-grid");
const loadingCircle = document.querySelector("#loading-circle");
const usableData = await fetchUsableData();

if (usableData) {
  loadingCircle.remove();

  for (const recipe of usableData) {
    const content = recipe.content.rendered;
    const cookingTimeMatch = content.match(
      /<p>Cooking time<\/p>\s*<p>(.*?)<\/p>/
    );
    const cookingTime = cookingTimeMatch
      ? cookingTimeMatch[1]
      : "Cooking time not available";
    const imageUrl = recipe._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    const recipeHTML = `
      <div class="recipe-card">
        <a href="/recipes-detailed.html?id=${recipe.id}">
          <img src="${imageUrl}" alt="Featured Image">
          <h3>${recipe.title.rendered}</h3>
          <p><strong>Cooking Time:</strong> ${cookingTime}</p>
        </a>
      </div>
    `;
    recipeGrid.innerHTML += recipeHTML;
  }
}
