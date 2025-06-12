import { Counter } from "@/components/counter";
import { UsersList } from "@/components/users-list";
import { db } from "@/lib/db";

export default async function Home() {
  const users = await db.user.findMany();

  return <UsersList users={users} />;
}
