import type { APIRoute } from "astro";
import { app } from "../../../config/firebase-server";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const amount = formData.get("amount");
  const date = formData.get("date");
  const category = formData.get("category");

  if (!title || !amount || !date || !category ) {
    return new Response("Faltan campos obligatorios", {
      status: 400,
    });
  }
  try {
    const db = getFirestore(app);
    const incomesRef = db.collection("incomes");
    await incomesRef.add({
      title,
      amount: Number(amount),
      date,
      category,
      createdAt: Date.now()

    });
  } catch (error) {
    console.error(error)
    return new Response("Algo salió mal", {
      status: 500,
    });
  }
  return redirect("/incomes");
};