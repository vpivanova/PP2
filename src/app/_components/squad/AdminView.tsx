import React from "react";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteTutor } from "~/app/api/action/squad";
import TutorSearch from "../../ui/tutorSearch";
import { db } from "~/server/db";
import { Students } from "../squad/students";
import { auth } from "~/server/auth";

interface AdminViewProps {
  squadId: string;
}

export async function AdminView({ squadId }: AdminViewProps) {
  const session = await auth();
  
  const squad = await db.squad.findUnique({
    where: { id: squadId },
    include: {       
      task: true, 
      tutor: true,
      StudentsOnTasks: {
        include: {
          student: true
        }
      }
    },
  });
  
  const task = squad?.task;
  const tutor = squad?.tutor;
  
  const role = session?.user.role;
  const isAuthorized = role === "ADMIN" || (squad?.tutorId === session?.user.id);
  
  if (!isAuthorized) {
    return <div>Not found</div>;
  }

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
              <td>
                <form action={deleteTutor} className="form-control">
                  <input type="hidden" name="squadId" defaultValue={squad?.id} />
                  <button type="submit">
                    <UserMinusIcon className="w-6" />
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
        <TutorSearch
          query={""}
          squadId={squad?.id ?? ""}          
        />
      </div>
      <Students squadId={squad?.id ?? ""} taskId={task?.id ?? ""} mode={true} squadTutorId={tutor?.id ?? ""}/>
    </main>
  );
}
