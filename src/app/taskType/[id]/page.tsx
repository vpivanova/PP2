import React from "react";
import { AdminTaskTypeComp } from "~/app/_components/role/Admin";
import { UserTaskTypeComp } from "~/app/_components/role/User";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function Page(props: { 
  params: Promise<{ id: string }>,
}) {
  const params = await props.params;
  const taskType = await db.taskType.findUnique({ where: { id: params.id } });
  const tasks = await db.task.findMany({ where: { taskTypeId: taskType?.id } });

  if (!taskType)
    return (
      <main>
        <h1>Task group not found</h1>
      </main>
    );

  const role = (await auth())?.user.role;
  const mode = role === "ADMIN" || role === "TUTOR";

  if (mode) {
    return <AdminTaskTypeComp taskType={taskType} tasks={tasks} />;
  }

  return <UserTaskTypeComp taskType={taskType} tasks={tasks} />;

}