import Link from "next/link";
import React from "react";
import { deleteUser, updateUser } from "~/app/api/action/user";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import Admin from "~/app/_components/role/Admin";
import Tutor from "~/app/_components/role/Tutor";
import User from "~/app/_components/role/User";

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
      return <Admin user={user} />;
    case "TUTOR":
      return <Tutor user={user} />;
    default:
      return <User user={user} />;
  }
}
