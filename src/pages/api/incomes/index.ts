import type { APIRoute } from "astro";
import { app } from "../../../config/firebase-server";
import { getFirestore } from "firebase-admin/firestore";
import cookie from 'cookie';
import { getAuth } from "firebase-admin/auth";

export const POST: APIRoute = async ({ request, redirect }) => {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const sessionCookie = cookies.session;
  const auth = getAuth(app);
  let user = null;

  if(sessionCookie) {
    user = await auth.verifySessionCookie(sessionCookie);
  }

  // Ahora puedes usar `user.uid` para obtener el ID del usuario
  const userId = user?.uid;
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const amount = formData.get("amount");
  const date = formData.get("date");
  const category = formData.get("category");

  

  if (!title || !amount || !date || !category || !userId) {
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
      createdAt: Date.now(),
      userId // Aquí estamos agregando el ID del usuario al documento
    });
  } catch (error) {
    console.error(error)
    return new Response("Algo salió mal", {
      status: 500,
    });
  }
  return redirect("/incomes");
};