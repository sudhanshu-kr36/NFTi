export default async function handleImageUpload(base64String: string): Promise<string> {
  try {
    // Convert base64 → file blob
    const blob = await (await fetch(base64String)).blob();
    const formData = new FormData();
    formData.append("file", blob, "ticket.png");

    // Call your backend instead of Infura
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.cid; // IPFS CID from Pinata
  } catch (err) {
    console.error("Upload failed:", err);
    return "";
  }
}
