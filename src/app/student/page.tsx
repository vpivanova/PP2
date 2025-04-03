import Link from "next/link";
import React from "react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import Admin from "~/app/_components/role/Admin";
import Tutor from "~/app/_components/role/Tutor";
import User from "~/app/_components/role/User";

export default async function Page() {
  const session = await auth();
  const user = await db.user.findUnique({ where: { id: session?.user?.id } });
  const tutors = await db.squad.findMany({
    where: { tutorId: user?.id },
    include: { task: true },
  });
  const studentsRow = await db.studentsOnTasks.findMany({
    where: { studentId: user?.id },
    include: { squad: { include: { task: true } } },
  });
  const grade = await db.grade.findMany({
    where: { studentId: user?.id },
    include: {
      task: { include: { squades: { include: { StudentsOnTasks: true } } } },
    },
  });

  const students = studentsRow.map((s) => {
    const g = grade.find((g) => g.task.id === s.squad.task.id);
    return { ...s, value: g?.value };
  });

  const tutorsJSX = tutors.map((tutor) => (
    <div key={tutor.id}>
      <p>
        <Link href={`/task/${tutor.task.id}`}>{tutor.task.name}</Link>
        {" - "}
        <Link href={`/squad/${tutor.id}`}>{"Поток"}</Link>
      </p>
    </div>
  ));
  const studentsJSX = students.map((student) => (
    <div key={student.squadId}>
      <p>
        <Link href={`/task/${student.squad.task.id}`}>
          {student.squad.task.name}
        </Link>
        {" - "}
        <Link href={`/squad/${student.squad.id}`}>
          {student?.value ?? "-"}
         </Link>
      </p>
    </div>
  ));

  const role = session?.user.role;

  switch (role) {
    case "ADMIN":
      return <Admin 
        user={user} 
        tutorsJSX={tutorsJSX} 
        studentsJSX={studentsJSX} 
      />;
    case "TUTOR":
      return <Tutor 
        user={user} 
        tutorsJSX={tutorsJSX} 
        studentsJSX={studentsJSX} 
      />;
    default:
      return <User 
        user={user} 
        tutorsJSX={tutorsJSX} 
        studentsJSX={studentsJSX} 
      />;
  }
}
