import { prisma } from "~/server/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password, token } = req.query;

  if (!username || !password || !token) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Validate token

  if (token !== process.env.SUPER_ADMIN_TOKEN_CREATION) {
    return res.status(403).json({ error: "Invalid token" });
  }

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    // If the user doesn't exist, create them with SUPER_ADMIN role
    const newUser = await prisma.user.create({
      data: {
        username,
        password, // Hash the password before saving it
        role: "SUPER_ADMIN",
      },
    });

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
