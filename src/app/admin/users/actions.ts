"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function changeUserRole(userId: string, newRole: "ADMIN" | "USER") {
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/admin/users");
}
