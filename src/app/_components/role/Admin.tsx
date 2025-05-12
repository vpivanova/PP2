import Link from "next/link";
import React, { Suspense } from "react";
import { deleteUser, updateUser } from "~/app/api/action/user";
import { type Group } from "@prisma/client";
import { type User } from "@prisma/client";
import GroupUser from "~/app/_components/group/groupUser";
import UserSearch from "~/app/ui/userSearch";
import { deleteGroup, updateGroup } from "~/app/api/action/group";
import { TaskTable } from "../task/table";
import { AddTask } from "../task/add";
import { deleteTaskType, updateTaskType } from "~/app/api/action/taskType";
import TutorSearch from "~/app/ui/tutorSearch";
import { Students } from "../squad/students";
import { deleteTutor } from "~/app/api/action/squad";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import { addUserTask, deleteTask, deleteUserTask, updateTask } from "~/app/api/action/task";



interface AdminProps {
  user: User & { group?: Group | null };
}

export default function Admin({ user }: AdminProps) {
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
      <form action={updateUser as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={user.id ?? ""} />
          <label>Электронная почта</label>
          <input
            type="email"
            name="email"
            required
            className="input input-bordered"
            defaultValue={user.email ?? ""}
          />
          <label>Имя</label>
          <input
            type="text"
            name="firstname"
            required
            className="input input-bordered"
            defaultValue={user.firstname ?? ""}
          />
          <label>Фамилия</label>
          <input
            type="text"
            name="surname"
            required
            className="input input-bordered"
            defaultValue={user.surname ?? ""}
          /> 
          <label>Роль</label>
          <select
            name="role"
            required
            className="select select-bordered"
            defaultValue={user.role ?? "USER"}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="TUTOR">TUTOR</option>
          </select>
          {groupJSX}         
          <button type="submit" className="btn btn-primary">
            Обновить
          </button>
        </div>
      </form>
      <form action={deleteUser as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={user.id ?? ""} />
          <button type="submit" className="btn btn-primary">
            Удалить
          </button>
        </div>
      </form>
    </main>
  );
}



export function AdminGroupComp({
  group,
  query,
}: {
  group: { id: string; name: string };
  query: string;
}) {
  return (
    <main>
      <form action={updateGroup as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={group.id ?? ""} />
          <label>Название</label>
          <input
            type="text"
            name="name"
            required
            className="input input-bordered"
            defaultValue={group.name ?? ""}
          />
          <button type="submit" className="btn btn-primary">
            Обновить
          </button>
        </div>
      </form>
      <form action={deleteGroup as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={group.id ?? ""} />
          <button type="submit" className="btn btn-primary">
            Удалить
          </button>
        </div>
      </form>
      <UserSearch query={query} id_group={group.id} />
      <Suspense fallback={<div>Loading...</div>}>
        <GroupUser group={group} />
      </Suspense>
    </main>
  );
}

export function AdminTaskComp({ task, taskType }: { task: any; taskType: any }) {
  return (
    <main>
      <Link href={`/taskType/${task.taskTypeId}`} className="btn btn-primary">
        {taskType?.name}
      </Link>
      <form action={updateTask as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={task.id ?? ""} />
          <label>Название</label>
          <input
            type="text"
            name="name"
            required
            className="input input-bordered"
            defaultValue={task.name ?? ""}
          />
          <label>Максимальная оценка</label>
          <input
            type="number"
            name="value"
            required
            className="input input-bordered"
            defaultValue={task.value}
          />
          <button type="submit" className="btn btn-primary">
            Обновить
          </button>
        </div>
      </form>
      <table className="m-4 box-border">
        <tbody>
          {task.squades.map((squad: any, index: number) => (
            <tr key={squad.id}>
              <td>
                <Link href={`/squad/${squad.id}`} className="btn btn-primary">
                  {"Поток " + (index + 1)}
                </Link>
              </td>
              <td>
                {index !== 0 && (
                  <form action={deleteUserTask as any} className="form-control">
                    <input
                      type="hidden"
                      name="id"
                      defaultValue={squad.id ?? ""}
                    />
                    <button type="submit" className="btn btn-primary">
                      Удалить поток
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form action={addUserTask as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={task.id ?? ""} />
          <button type="submit" className="btn btn-primary">
            Добавить поток
          </button>
        </div>
      </form>
      <form action={deleteTask as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={task.id ?? ""} />
          <input
            type="hidden"
            name="taskTypeId"
            defaultValue={task.taskTypeId ?? ""}
          />
          <button type="submit" className="btn btn-primary">
            Удалить
          </button>
        </div>
      </form>
    </main>
  );
}

export function AdminTaskTypeComp({ taskType, tasks }: { taskType: any; tasks: any[] }) {
  return (
    <main>
      <form action={updateTaskType as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={taskType.id ?? ""} />
          <label>Название</label>
          <input
            type="text"
            name="name"
            required
            className="input input-bordered"
            defaultValue={taskType.name ?? ""}
          />
          <button type="submit" className="btn btn-primary">
            Обновить
          </button>
        </div>
      </form>
      <form action={deleteTaskType as any} className="form-control">
        <div className="flex max-w-xs flex-col space-y-2">
          <input type="hidden" name="id" defaultValue={taskType.id ?? ""} />
          <button type="submit" className="btn btn-primary">
            Удалить
          </button>
        </div>
      </form>
      <AddTask taskType={taskType} />
      <TaskTable tasks={tasks} />
    </main>
  );
}


// export function AdminSquadComp({
//   task,
//   tutor,
//   squadId,
//   query,
// }: {
//   task?: { id: string; name: string } | null;
//   tutor?: { id: string; firstname: string | null; surname: string | null } | null;
//   squadId: string;
//   query: string;
// }) {
//   return (
//     <main>
//       <Link href={`/task/${task?.id}`} className="btn btn-primary">
//         {task?.name}
//       </Link>
//       <div>
//         <table className="m-4 box-border">
//           <tbody>
//             <tr>
//               <td>Преподаватель:</td>
//               <td>
//                 {tutor ? `${tutor.firstname} ${tutor.surname}` : "Не назначен"}
//               </td>
//               <td>
//                 <form action={deleteTutor} className="form-control">
//                   <input type="hidden" name="squadId" defaultValue={squad?.id} />
//                   <button type="submit">
//                     <User MinusIcon className="w-6" />
//                   </button>
//                 </form>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <TutorSearch query={query} squadId={squad.id} />
//       </div>
//       <Students squadId={squad.id} taskId={task?.id ?? ""} mode={true} squadTutorId={tutor?.id ?? ""} />
//     </main>
//   );
// }
