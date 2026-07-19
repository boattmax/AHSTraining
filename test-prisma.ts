import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("No DB URL");
  
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Connecting to DB...");
  try {
    const user = await prisma.user.create({
      data: {
        email: "test_google_oauth@example.com",
        name: "Test User",
        image: "https://example.com/image.png"
      }
    });
    console.log("User created:", user);
    
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "1234567890",
        access_token: "dummy_access_token",
        expires_at: 1700000000,
        token_type: "Bearer",
        scope: "openid profile email",
        id_token: "dummy_id_token"
      }
    });
    console.log("Account created:", account);

    // Clean up
    await prisma.account.delete({ where: { id: account.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log("User deleted.");
  } catch (error) {
    console.error("Prisma Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
