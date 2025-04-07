import { db } from "~/server/db";
import { AddUser } from "../_components/user/addUser";
import UserTable from "../_components/user/userTable";
import Pagination from "../ui/pagination";
import GroupTable from "../_components/group/groupTable";
import { AddGroup } from "../_components/group/addGroup";
import { auth } from "~/server/auth";


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
  // const groups = await db.group.findMany({
  //   skip: (page - 1) * size,
  //   take: size,
  // });
  const pages = Math.ceil(Number(count) / size);
  //const users = await db.user.findMany();

  const role = (await auth())?.user.role;
  
  return (
    <>
      <h1>Group page</h1>
      {role === "ADMIN" && <AddGroup />}
      <GroupTable page={page} size={size} key={page}/>
      <Pagination totalPages={pages} />
    </>
  );
}
