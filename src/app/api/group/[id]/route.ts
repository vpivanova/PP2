import { NextRequest } from "next/server";
import { sleep } from "node_modules/@trpc/server/dist/unstable-core-do-not-import/utils";
import { db } from "~/server/db";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const id = (await params).id
    const { name } = await request.json();
    const group = await db.group.update({
        where: { id },
        data: {
            name,
        },
    });
    return new Response(JSON.stringify(group), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
   
    const deletedGroup = await db.group.delete({
        where: { id },
    });
    await sleep(9000);
    return new Response(JSON.stringify(deletedGroup), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

  