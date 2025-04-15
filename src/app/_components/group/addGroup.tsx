"use client";

import React, { useState } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";

export function AddGroup() {
  const [name, setName] = useState("");

  const postMutation = useMutation({
    mutationFn: async (group: { name: string }) => {
      const response = await fetch(`/api/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(group),
      });
      return response.json();
    },
    onSuccess: () => {
      setName(""); // Очистка поля после успешного добавления
      window.location.reload(); // Обновление страницы для получения актуальных данных
    },
  });

  const addGroup = (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    postMutation.mutate({ name }); // Отправляем только название группы
  };

  return (
    <details className="collapse bg-base-100" tabIndex={0}>
      <summary className="collapse-title text-xl font-medium">
        <FolderPlusIcon className="w-6" />
      </summary>
      <form onSubmit={addGroup} className="collapse-content form-control">
        <div className="flex flex-col max-w-xs space-y-2">
          <label>Название</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // обновляем состояние при вводе
            required
            className="input input-bordered"
          />
          <button type="submit" className="btn btn-primary">
            Добавить
          </button>
        </div>
      </form>
    </details>
  );
}


