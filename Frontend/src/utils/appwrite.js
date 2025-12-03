// import { Client, Storage } from "appwrite";

// const client = new Client()
//   .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
//   .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID); // Set in .env

// const storage = new Storage(client);

// export const uploadImage = async (file) => {
//   try {
//     const response = await storage.createFile(
//       process.env.REACT_APP_APPWRITE_BUCKET_ID,
//       "unique()",
//       file
//     );
//     const fileId = response.$id;
//     const fileUrl = `${process.env.REACT_APP_APPWRITE_ENDPOINT}/storage/buckets/${process.env.REACT_APP_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;
//     console.log("Image uploaded to Appwrite:", fileUrl);
//     return fileUrl;
//   } catch (error) {
//     console.error("Appwrite upload error:", error.message);
//     throw error;
//   }
// };
