"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";
import { isAdmin } from "../auth/checks";

export async function createTask(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Нет прав"}
  }
  const fd = z
    .object({
      taskTypeId: z.string(),
      name: z.string(),
      //value: z.string().transform(Number)
    })
    .parse({
      taskTypeId: formData.get("taskTypeId"),
      name: formData.get("name"),
      //value: formData.get("value"),
    });
  const task = await db.task.create({ data: fd });
  await db.squad.create({ data: { taskId: task.id, date: new Date() } });
  revalidatePath("/taskGroup/" + fd.taskTypeId);
}

export async function deleteTask(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Нет прав"}
  }
  const fd = z
    .object({
      id: z.string(),
      taskTypeId: z.string(),
    })
    .parse({
      id: formData.get("id"),
      taskTypeId: formData.get("taskTypeId"),
    });
  await db.task.delete({ where: { id: fd.id } });
  redirect("/taskType/" + fd.taskTypeId);
}

export async function updateTask(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Нет прав"}
  }
  const fd = z
    .object({
      id: z.string(),
      name: z.string(),
      value: z.coerce.number(),
    })
    .parse({
      id: formData.get("id"),
      name: formData.get("name"),
      value: formData.get("value"),
    });
  await db.task.update({ where: { id: fd.id }, data: fd });
  revalidatePath("/task/" + fd.id);
}

export async function addUserTask(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Нет прав"}
  }
  const id = formData.get("id") as string;
  await db.squad.create({
    data: { taskId: id, date: new Date() },
  });
  revalidatePath("/task/" + id);
}

export async function deleteUserTask(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Нет прав"}
  }
  const id = formData.get("id") as string;
  await db.squad.delete({ where: { id: id } });
  revalidatePath("/task/" + id);
}