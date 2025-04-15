import Link from "next/link";
import React, { Suspense } from "react";
import { type User, type Group } from "@prisma/client";
import { Students } from "~/app/_components/squad/students";
import GroupUser from "~/app/_components/group/groupUser";
import { TaskTable } from "../task/table";

interface UserProps {
    user: User & { group?: Group | null };
}

export default function User({ user }: UserProps) {
    const groupJSX = user?.group && (
        <>
            <label>Группа</label>
            <Link className="btn" href={"/group/" + user?.group.id}>
                {user?.group.name + "-" + user.subgroup}
            </Link>
        </>
    );

    return (
        <main>
            <h1>Данные пользователя</h1>
            <p>Электронная почта: {user.email}</p>
            <p>Имя: {user.firstname}</p>
            <p>Фамилия: {user.surname}</p>
            <p>Роль: {user.role}</p>
            {groupJSX}
        </main>
    );
}

  export function UserComponentSquad({
    task,
    tutor,
    squad,
  }: {
    task?: { id: string; name: string } | null;
    tutor?:{ id: string; firstname: string | null; surname: string | null } | null;
    //squad?: { id: string; name: string} | null;
    squad?: {
      id: string;
      task: true, 
      tutor: true,
      StudentsOnTasks: {
        include: {
          student: true
        }
      } },
  }) {
    return (
      <main>
      <Link href={`/task/${task?.id}`} className="btn btn-primary">
        {task?.name}
      </Link>
      <div>
        <table className="m-4 box-border">
          <tbody>
            <tr>
              <td>Преподаватель:</td>
              <td>
                {tutor ? tutor.firstname + " " + tutor.surname : "Не назначен"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Students squadId={squad?.id ?? ""} taskId={task?.id ?? ""} mode={true} squadTutorId={tutor?.id ?? ""}/>
      {/* <Students squadId={squad?.id ?? ""} taskId={task?.id ?? ""} mode={false}/> */}
    </main>
    );
  }

export function UserGroupComp({ group }: { group: { id: string; name: string } }) {
    return (
      <main>
        <h1>Группа</h1>
        <h2>{group.name}</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <GroupUser group={group} />
        </Suspense>
      </main>
    );
}

export function UserTaskComp({ task, taskType }: { task: any; taskType: any }) {
  return (
    <main>
      <Link href={`/taskType/${task.taskTypeId}`} className="btn btn-primary">
        {taskType?.name}
      </Link>
      <h1>{task.name}</h1>
      <table className="m-4 box-border">
        <tbody>
          {task.squades.map((squad: any, index: number) => (
            <tr key={squad.id}>
              <td>
                <Link href={`/squad/${squad.id}`} className="btn btn-primary">
                  {"Поток " + (index + 1)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export function UserTaskTypeComp({ taskType, tasks }: { taskType: any; tasks: any[] }) {
  return (
    <main>
      <h1>{taskType.name}</h1>
      <TaskTable tasks={tasks} />
    </main>
  );
}

export function UserDetailsComp({ user }: { user: any }) {
  const groupJSX = user?.group && (
    <>
      <p>Группа: <Link href={"/group/" + user?.group.id}>{user?.group.name + "-" + user.subgroup}</Link></p>
    </>
  );

  return (
    <main>
      <h1>Данные пользователя</h1>
      <p>Электронная почта: {user.email}</p>
      <p>Имя: {user.firstname}</p>
      <p>Фамилия: {user.surname}</p>
      <p>Роль: {user.role}</p>
      {groupJSX}
    </main>
  );
}