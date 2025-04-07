import React from "react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { AdminView } from "../../_components/squad/AdminView";
import { TeacherView } from "../../_components/squad/TeacherView";
import { StudentView } from "../../_components/squad/StudentView";
// import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string  }>;
  searchParams: Promise<{
    query?: string;
    student?: string;
  }>;
}) {
  const params = await props.params;
  const session = await auth();
  const role = session?.user.role;
  
  const squad = await db.squad.findUnique({
    where: { id: params.id },
    include: { tutor: true },
  });

  // Determine which view to render based on user role
  const isAdmin = role === "ADMIN";
  const isTutor = squad?.tutorId === session?.user.id;

  // const gr = await api.post.hello({ text: "server world" });
  // console.log("\n\nTRPC\n\n", gr);

  if (isAdmin || isTutor) {
    return <AdminView squadId={params.id} />;
  } else if (role === "TEACHER") {
    return <TeacherView squadId={params.id} />;
  } else {
    return <StudentView squadId={params.id} />;
  }
}
