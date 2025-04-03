import Link from "next/link";
import React from "react";
import { deleteUser, updateUser } from "~/app/api/action/user";
import { type User, type Group } from "@prisma/client";

interface AdminProps {
  user: User & { group?: Group | null };
  tutorsJSX?: React.ReactNode;
  studentsJSX?: React.ReactNode;
}

export default function Admin({ user, tutorsJSX, studentsJSX }: AdminProps) {
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
      <form action={updateUser} className="form-control">
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

      <form action={deleteUser} className="form-control">
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
