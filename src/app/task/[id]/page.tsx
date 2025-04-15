import Link from "next/link";
import React from "react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { AdminTaskComp } from "~/app/_components/role/Admin";
import { UserTaskComp } from "~/app/_components/role/User";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const task = await db.task.findUnique({
    where: { id: params.id },
    include: { squades: true },
  });
  const taskType = await db.taskType.findUnique({
    where: { id: task?.taskTypeId },
  });

  if (!task)
    return (
      <main>
        <h1>Task not found</h1>
      </main>
    );
    const role = (await auth())?.user.role;
    const mode = role === "ADMIN" || role === "TUTOR";
    
  if (mode) {
    return <AdminTaskComp task={task} taskType={taskType} />;
  }

  return <UserTaskComp task={task} taskType={taskType} />;
}