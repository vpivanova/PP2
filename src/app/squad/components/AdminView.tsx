import React from "react";
import Link from "next/link";
import { db } from "~/server/db";
import { Students } from "~/app/_components/squad/students";
import { auth } from "~/server/auth";

interface TeacherViewProps {
  squadId: string;
}

const TeacherView: React.FC<TeacherViewProps> = ({ squadId }) => {
  const session = await auth();
  const role = session?.user.role;

  // Fetch the squad with associated task, tutor, and students
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

  if (!squad) {
    return <div>Squad not found</div>;
  }

  const task = squad.task;
  const tutor = squad.tutor;

  // Check if user has teacher role
  if (role !== "TEACHER") {
    return <div>Unauthorized access</div>;
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
            </tr>
          </tbody>
        </table>
      </div>
      <Students squadId={squad.id} taskId={task?.id ?? ""} mode={true} squadTutorId={tutor?.id ?? ""}/>
    </main>
  );
}

export default TeacherView;
