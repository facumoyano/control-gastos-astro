import type { APIRoute } from "astro";
import { app } from "../../../../config/firebase-server";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(app);
const incomesRef = db.collection("incomes");

export const POST: APIRoute = async ({ params, redirect, request }) => {
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

  if (!params.id) {
    return new Response("No se puede encontrar el amigo", {
      status: 404,
    });
  }

  try {
    await incomesRef.doc(params.id).update({
        title,
        amount,
        date,
        category
    });
  } catch (error) {
    return new Response("Algo salió mal", {
      status: 500,
    });
  }
  return redirect("/");
};

export const DELETE: APIRoute = async ({ params, redirect }) => {
  if (!params.id) {
    return new Response("No se puede encontrar el amigo", {
      status: 404,
    });
  }

  try {
    await incomesRef.doc(params.id).delete();
  } catch (error) {
    return new Response("Algo salió mal", {
      status: 500,
    });
  }
  return redirect("/incomes");
};