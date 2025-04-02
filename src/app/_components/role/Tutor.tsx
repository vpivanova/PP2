import Link from "next/link";
import React from "react";
import { type User, type Group } from "@prisma/client";

interface TutorProps {
  user: User & { group?: Group | null };
}

export default function Tutor({ user }: TutorProps) {
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
