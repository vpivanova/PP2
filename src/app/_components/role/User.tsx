import Link from "next/link";
import React from "react";
import { type User, type Group } from "@prisma/client";

interface UserProps {
  user: User & { group?: Group | null };
  tutorsJSX?: React.ReactNode;
  studentsJSX?: React.ReactNode;
}

export default function User({ user, tutorsJSX, studentsJSX }: UserProps) {
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
      <h1>{user?.firstname + " " + user?.surname}</h1>
      <div>
        <p>Электронная почта: {user.email}</p>
        <p>Имя: {user.firstname}</p>
        <p>Фамилия: {user.surname}</p>
        <p>Роль: {user.role}</p>
        {groupJSX}
      </div>

      {tutorsJSX && (
        <div>
          <h2>Преподаватель</h2>
          {tutorsJSX}
        </div>
      )}

      {studentsJSX && (
        <div>
          <h2>Студент</h2>
          {studentsJSX}
        </div>
      )}
    </main>
  );
}
