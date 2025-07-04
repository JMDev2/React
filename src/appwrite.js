import { Client, Databases, Query, ID } from "appwrite";
import { data } from "autoprefixer";

// Appwrite project details
const VITE_APP_ID = '6864a8a1003c9f6d2056';
const VITE_APPWRITE_DATABASE = '6864aa3a000e05a42466';
const VITE_APPWRITE_METRICS = '6864aa8000152d0e5f60';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(VITE_APP_ID); // ✅ You had it hardcoded and repeated — use the constant here

const database = new Databases(client);

// Main function
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Step 1: Check if the search term already exists
    const result = await database.listDocuments(
      VITE_APPWRITE_DATABASE,
      VITE_APPWRITE_METRICS,
      [Query.equal('searchTerm', searchTerm)]
    );

    if (result.documents.length > 0) {
      // Step 2: If it exists, update the count
      const doc = result.documents[0];

      await database.updateDocument(
        VITE_APPWRITE_DATABASE,
        VITE_APPWRITE_METRICS,
        doc.$id,
        {
          count: doc.count + 1,
        }
      );
    } else {
      // Step 3: If it doesn't exist, create a new document
      await database.createDocument(
        VITE_APPWRITE_DATABASE,
        VITE_APPWRITE_METRICS,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id, // ✅ Use fields from passed-in movie object
          poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error('Error updating search count:', error);
  }
};

//fetching the trending movies from appwrite
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(
      VITE_APPWRITE_DATABASE,
      VITE_APPWRITE_METRICS,
      [
        Query.orderDesc("count"),
        Query.limit(5),
      ]
    );

    return result.documents;
  } catch (error) {
    return [];
  }
};