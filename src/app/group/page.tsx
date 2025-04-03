import { db } from "~/server/db";
import { AddUser } from "../_components/user/addUser";
import UserTable from "../_components/user/userTable";
import Pagination from "../ui/pagination";
import GroupTable from "../_components/group/groupTable";
import { AddGroup } from "../_components/group/addGroup";
import { auth } from "~/server/auth";
import { AdminRole, TutorRole, UserRole } from "~/app/_components/role/Role";


export default async function Page(props: {
  searchParams?: Promise<{
    size?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 3;

  const count = await db.group.count();
  const groups = await db.group.findMany({
    skip: (page - 1) * size,
    take: size,
  });
  const pages = Math.ceil(Number(count) / size);
  //const users = await db.user.findMany();

  const role = (await auth())?.user.role;
  
  if (role === "ADMIN") {
    return (
      <AdminRole groups={groups}>
        <AddGroup />
        <GroupTable groups={groups} />
        <Pagination totalPages={pages} />
      </AdminRole>
    );
  } else if (role === "TUTOR") {
    return (
      <TutorRole groups={groups}>
        <GroupTable groups={groups} />
        <Pagination totalPages={pages} />
      </TutorRole>
    );
  } else {
    return (
      <UserRole groups={groups}>
        <GroupTable groups={groups} />
        <Pagination totalPages={pages} />
      </UserRole>
    );
  }
}
