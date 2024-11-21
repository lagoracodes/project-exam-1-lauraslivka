async function fetchWPAPIData() {
  try {
    const response = await fetch(
      "http://cozycatbakeryapi.online/wp-json/wp/v2/posts?_embed=true"
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
    console.log(data);
    return data;
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
