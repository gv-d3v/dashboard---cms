export const GetWebsites = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "..";
  
    //const production = '..'
  
    try {
      const resWebsitesExists = await fetch(`${apiBaseUrl}/api/websitesShow`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
  
      if (!resWebsitesExists.ok) {
        throw new Error(`Failed to fetch accommodation data: ${resWebsitesExists.status}`);
      }
  
      const data = await resWebsitesExists.json();
      return data.websites || [];
    } catch (error) {
      console.error("Error fetching Accommodation data:", error);
      return [];
    }
  };
  