document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");
  const loadingCircle = document.querySelector("#loading-circle");

  async function fetchRecipeDetails() {
    try {
      const response = await fetch(
        `http://cozycatbakeryapi.online/wp-json/wp/v2/posts/${recipeId}?_embed`
      );
      const recipe = await response.json();
      displayRecipeDetails(recipe);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      document.getElementById(
        "recipes-detailed"
      ).innerHTML = `<p>Error loading the recipe. Please try again later.</p>`;
    }
  }

  function displayRecipeDetails(recipe) {
    const container = document.getElementById("recipes-detailed");
    const imageUrl = recipe._embedded["wp:featuredmedia"]?.[0]?.source_url;
    loadingCircle.remove();
    const content = `
      <div id="recipes-detailed-container">
        <h1>${recipe.title.rendered}</h1>
        <img src="${imageUrl}" alt="${recipe.title.rendered}">
        <section class="recipe-ingredients">
          <h2>Ingredients</h2>
          <ul>
            ${extractList(recipe.content.rendered, "Ingredients")}
          </ul>
        </section>
        <section class="recipe-instructions">
          <h2>Instructions</h2>
          <ul>
            ${extractList(recipe.content.rendered, "Cooking Instructions")}
          </ul>
        </section>
      </div>
    `;
    container.innerHTML = content;
  }

  function extractList(content, heading) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const headings = doc.querySelectorAll("p, strong, h2, h3, h4");
    let targetHeading = null;

    for (const h of headings) {
      if (h.textContent.trim().toLowerCase().includes(heading.toLowerCase())) {
        targetHeading = h;
        break;
      }
    }

    if (targetHeading) {
      let nextElement = targetHeading.nextElementSibling;

      while (nextElement) {
        if (nextElement.tagName === "UL" || nextElement.tagName === "OL") {
          return nextElement.innerHTML;
        }
        nextElement = nextElement.nextElementSibling;
      }
    }
    return "<li>Not available</li>";
  }

  if (recipeId) {
    fetchRecipeDetails();
  }
});
