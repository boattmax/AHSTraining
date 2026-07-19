import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function TestSessionPage() {
  const session = await getServerSession(authOptions);
  return (
    <pre style={{ padding: '2rem', background: '#f4f4f4' }}>
      {JSON.stringify(session, null, 2)}
    </pre>
  );
}
