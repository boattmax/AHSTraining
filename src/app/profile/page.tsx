import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  // Fetch full user details
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container" style={{ margin: '2rem auto', maxWidth: '800px' }}>
      <ProfileForm user={user} />
    </div>
  );
}
