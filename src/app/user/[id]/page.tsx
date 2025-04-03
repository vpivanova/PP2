import Link from "next/link";
import React from "react";
import { deleteUser, updateUser } from "~/app/api/action/user";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { AdminRole, TutorRole, UserRole } from "~/app/_components/role/Role";

export default async function Page(
  props: { params: Promise<{ id: string }> }
) {
  const role = (await auth())?.user.role;

  const params = await props.params;
  const user = await db.user.findUnique({ where: { id: params.id }, include: {group: true,}, });

  if (!user)
    return (
      <main>
        <h1>User not found</h1>
      </main>
    );

  switch (role) {
    case "ADMIN":
      return <AdminRole user={user} />;
    case "TUTOR":
      return <TutorRole user={user} />;
    default:
      return <UserRole user={user} />;
  }
}
