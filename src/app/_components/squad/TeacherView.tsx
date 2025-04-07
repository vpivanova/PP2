import React from "react";
import Link from "next/link";
import { db } from "~/server/db";
import { Students } from "../squad/students";
import { auth } from "~/server/auth";

interface TeacherViewProps {
  squadId: string;
}

export async function TeacherView({ squadId }: TeacherViewProps) {
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
    </main>
  );
}
