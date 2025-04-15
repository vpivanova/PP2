"use client";

import React, { useEffect, useState } from "react";
import { CheckIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Group } from "@prisma/client";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function GroupTable({
  page,
  size,
}: {
  page?: number;
  size?: number;
}) {
  const [groupNames, setGroupsNames] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const url = `/api/group?size=${size || 3}&page=${page || 1}`;
  
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groups", page, size],
    queryFn: async () => {
      const groups = await fetch(url).then((res) => res.json());
      return groups;
    },
  });

  const putMutation = useMutation({
    mutationFn: async (group: Group) => {
      const response = await fetch(`/api/group/${group.id}`, {
        method: "PUT",
        body: JSON.stringify(group),
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/group/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      // Обновляем страницу после успешного удаления
      window.location.reload();
    },
  });

  useEffect(() => {
    if (data) {
      setGroups(data);
      setGroupsNames(data.map((u: Group) => u.name));
    }
  }, [data]);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  function handleChangeName(id: string, index: number) {
    putMutation.mutate({ id, name: groupNames[index] ?? "" });
  }

  function handleEditGroup(index: number, name: string) {
    setGroupsNames((prev: string[]) => [
      ...prev.slice(0, index),
      name,
      ...prev.slice(index + 1),
    ]);
  }

  function handleDeleteGroup(id: string) {
    deleteMutation.mutate(id);
  }

  return (
    <>
      <table className="m-4 box-border">
        <thead>
          <tr>
            <th>Название</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {groups.map((u, index) => (
            <tr key={u.id}>
              <td className="px-2">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder={"Имя группы"}
                  onChange={(e) => {
                    handleEditGroup(index, e.target.value);
                  }}
                  value={groupNames[index] || ""}
                />
              </td>
              <td className="px-2">
                <button onClick={() => handleChangeName(u.id, index)}>
                  <CheckIcon className="w-6" />
                </button>
              </td>
              <td className="px-2">
                <Link href={`/group/${u.id}`}>
                  <PencilSquareIcon className="w-4" />
                </Link>
              </td>
              <td className="px-2">
                <button onClick={() => handleDeleteGroup(u.id)}>
                  <TrashIcon className="w-6 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
