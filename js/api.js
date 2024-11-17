async function fetchWPAPIData() {
  try {
    const response = await fetch(
      "http://localhost/cozycatbakery/wp-json/wp/v2/posts?_embed"
    );
    if (!response.ok)
      throw new Error("Network response was not ok " + response.statusText);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

export const usableData = await fetchWPAPIData()
  .then((data) => {
    return data;
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
