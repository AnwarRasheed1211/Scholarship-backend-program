import { connectToDatabase } from "../../lib/db";
import Works from "@/models/Work"

export default async (req, res) => {
  if (req.method === "POST"){

  try {
    // Connect to the scholarship database
    const db = await connectToDatabase("scholarship"); // Replace "scholarship" with your actual database name

    // Specify the collection you want to query (e.g., "work")
    const newWork = new Works(req.body);
    await newWork.save();


     // Respond with a success message
      res.status(201).json({ message: "Work data saved successfully" });
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
