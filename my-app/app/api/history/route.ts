import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get uploads only for the current user
    const uploads = await prisma.analysis.findMany({
      where: {
        userEmail: session.user.email,
      },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(uploads), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}