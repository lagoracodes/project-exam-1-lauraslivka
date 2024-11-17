document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  async function fetchRecipeDetails() {
    try {
      const response = await fetch(
        `http://localhost/cozycatbakery/index.php/wp-json/wp/v2/posts/${recipeId}?_embed`
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
    const imageUrl = recipe._embedded["wp:featuredmedia"]
      ? recipe._embedded["wp:featuredmedia"][0].source_url
      : "path_to_default_image.jpg";
    const content = `
        <h1>${recipe.title.rendered}</h1>
        <img src="${imageUrl}" alt="${recipe.title.rendered}">
        <div>${recipe.content.rendered}</div>
      `;
    container.innerHTML = content;
  }

  if (recipeId) {
    fetchRecipeDetails();
  }
});
