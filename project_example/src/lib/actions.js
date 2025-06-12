"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";

export async function createUser(formData) {
  await db.user.create({
    data: { name: formData.get("name"), email: formData.get("email") },
  });

  revalidatePath("/");
}
