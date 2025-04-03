import React from "react";
import { type User, type Group, type Task, type Squad, type TaskType } from "@prisma/client";

// Common interfaces for all roles
export interface BaseRoleProps {
  user?: User & { group?: Group | null };
  group?: Group;
  task?: Task & { squades?: Squad[] };
  squad?: Squad & { 
    task?: Task;
    tutor?: User;
    StudentsOnTasks?: Array<{
      student: User;
    }>;
  };
  taskType?: TaskType;
  tasks?: Task[];
  groups?: Group[];
  query?: string;
  tutorsJSX?: React.ReactNode;
  studentsJSX?: React.ReactNode;
}

// Admin-specific props
export interface AdminRoleProps extends BaseRoleProps {
  onUpdate?: (data: any) => void;
  onDelete?: (id: string) => void;
  id_group?: string;
  squadId?: string;
  taskId?: string;
}

// Tutor-specific props
export interface TutorRoleProps extends BaseRoleProps {
  mode?: boolean;
}

// User-specific props
export interface UserRoleProps extends BaseRoleProps {
  // User-specific props can be added here if needed
}

// Props for the Role component
export interface RoleProps {
  role: "ADMIN" | "TUTOR" | "USER";
  props: BaseRoleProps & AdminRoleProps & TutorRoleProps & UserRoleProps;
}

// Component for rendering content based on role
export default function Role({ role, props }: RoleProps) {
  switch (role) {
    case "ADMIN":
      return <AdminRole {...props} />;
    case "TUTOR":
      return <TutorRole {...props} />;
    default:
      return <UserRole {...props} />;
  }
}

// Admin role component
export function AdminRole(props: AdminRoleProps) {
  // Group page
  if (props.groups) {
    return (
      <>
        <h1>Group page</h1>
        {/* Admin can add new groups */}
        {props.children}
      </>
    );
  }
  
  // Group [id] page
  if (props.group) {
    return (
      <main>
        {/* Admin can update and delete groups */}
        {props.children}
      </main>
    );
  }

  // Squad [id] page
  if (props.squad) {
    return (
      <main>
        {/* Admin can manage squad tutors and students */}
        {props.children}
      </main>
    );
  }

  // Task [id] page
  if (props.task) {
    return (
      <main>
        {/* Admin can update and delete tasks */}
        {props.children}
      </main>
    );
  }

  // TaskType [id] page
  if (props.taskType) {
    return (
      <main>
        {/* Admin can update and delete task types */}
        {props.children}
      </main>
    );
  }

  // TaskType page
  if (props.tasks) {
    return (
      <div>
        {/* Admin can add new task types */}
        {props.children}
      </div>
    );
  }

  // User [id] page
  if (props.user) {
    return (
      <main>
        {/* Admin can update and delete users */}
        {props.children}
      </main>
    );
  }

  // User page
  return (
    <>
      <h1>User page</h1>
      {/* Admin can add new users */}
      {props.children}
    </>
  );
}

// Tutor role component
export function TutorRole(props: TutorRoleProps) {
  // Group page
  if (props.groups) {
    return (
      <>
        <h1>Group page</h1>
        {props.children}
      </>
    );
  }
  
  // Group [id] page
  if (props.group) {
    return (
      <main>
        <h1>Группа</h1>
        <h2>{props.group.name}</h2>
        {props.children}
      </main>
    );
  }

  // Squad [id] page
  if (props.squad) {
    return (
      <main>
        {/* Tutor can manage their own squads */}
        {props.children}
      </main>
    );
  }

  // Task [id] page
  if (props.task) {
    return (
      <main>
        {/* Tutor can update tasks */}
        {props.children}
      </main>
    );
  }

  // TaskType [id] page
  if (props.taskType) {
    return (
      <main>
        {/* Tutor can update task types */}
        {props.children}
      </main>
    );
  }

  // TaskType page
  if (props.tasks) {
    return (
      <div>
        {/* Tutor can add new task types */}
        {props.children}
      </div>
    );
  }

  // User [id] page
  if (props.user) {
    return (
      <main>
        <h1>Данные пользователя</h1>
        {props.children}
      </main>
    );
  }

  // User page
  return (
    <>
      <h1>User page</h1>
      {props.children}
    </>
  );
}

// User role component
export function UserRole(props: UserRoleProps) {
  // Group page
  if (props.groups) {
    return (
      <>
        <h1>Group page</h1>
        {props.children}
      </>
    );
  }
  
  // Group [id] page
  if (props.group) {
    return (
      <main>
        <h1>Группа</h1>
        <h2>{props.group.name}</h2>
        {props.children}
      </main>
    );
  }

  // Squad [id] page
  if (props.squad) {
    return (
      <main>
        {/* User can view squad details */}
        {props.children}
      </main>
    );
  }

  // Task [id] page
  if (props.task) {
    return (
      <main>
        {/* User can view task details */}
        {props.children}
      </main>
    );
  }

  // TaskType [id] page
  if (props.taskType) {
    return (
      <main>
        <h1>{props.taskType.name}</h1>
        {props.children}
      </main>
    );
  }

  // TaskType page
  if (props.tasks) {
    return (
      <div>
        {props.children}
      </div>
    );
  }

  // User [id] page
  if (props.user) {
    return (
      <main>
        <h1>Данные пользователя</h1>
        {props.children}
      </main>
    );
  }

  // User page
  return (
    <>
      <h1>User page</h1>
      {props.children}
    </>
  );
}
