import { NextRequest } from "next/server";
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


export async function POST(request: NextRequest) {
    const { name } = await request.json();
    
    // Создание новой группы в базе данных
    const newGroup = await db.group.create({
        data: {
            name,
        },
    });

    return new Response(JSON.stringify(newGroup), {
        status: 201, // Статус 201 для успешного создания
        headers: { "Content-Type": "application/json" },
    });
}

  