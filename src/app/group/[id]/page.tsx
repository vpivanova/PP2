import React, { Suspense } from "react";
import { AdminGroupComp } from "~/app/_components/role/Admin";
import { UserGroupComp } from "~/app/_components/role/User";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export default async function Page(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ query?: string}> 
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const params = await props.params;
  const group  = await db.group.findUnique({ where: { id: params.id } });


  if (!group)
    return (
      <main>
        <h1>User not found</h1>
      </main>
    );
    const role = (await auth())?.user.role;

    if (role === "ADMIN")
    return <AdminGroupComp group={group} query={query} />;

    return <UserGroupComp group={group} />;
}
