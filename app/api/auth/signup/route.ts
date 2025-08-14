import { prisma } from "@/db.server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { name, email, password, company } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return new Response(JSON.stringify({ success: false, message: "User already exists" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, company },
  });

  return new Response(JSON.stringify({ success: true, user }), { status: 201 });
}
