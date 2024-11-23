export async function fetchUsableData() {
  try {
    const response = await fetch(
      "https://cozycatbakeryapi.online/wp-json/wp/v2/posts?_embed=true"
    );
    if (!response.ok)
      throw new Error("Network response was not ok " + response.statusText);
    const data = await response.json();
    console.log("Data fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
