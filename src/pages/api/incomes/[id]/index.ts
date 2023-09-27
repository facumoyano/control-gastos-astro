import type { APIRoute } from "astro";
import { app } from "../../../../config/firebase-server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from 'firebase-admin/auth';
import cookie from 'cookie';

const db = getFirestore(app);
const incomesRef = db.collection("incomes");
const auth = getAuth(app);

export const POST: APIRoute = async ({ params, redirect, request }) => {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const sessionCookie = cookies.session;
  let user = null;

  if(sessionCookie) {
    user = await auth.verifySessionCookie(sessionCookie);
  }

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

  if (!params.id) {
    return new Response("No se puede encontrar el ingreso", {
      status: 404,
    });
  }

  try {
    const doc = await incomesRef.doc(params.id).get();
    if (!doc.exists || doc?.data()?.userId !== userId) {
      return new Response("No tienes permiso para modificar este ingreso", {
        status: 403,
      });
    }

    await incomesRef.doc(params.id).update({
      title,
      amount,
      date,
      category,
      userId
    });
  } catch (error) {
    return new Response("Algo salió mal", {
      status: 500,
    });
  }
  return redirect("/");
};

export const DELETE: APIRoute = async ({ params, redirect, request }) => {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const sessionCookie = cookies.session;
  let user = null;

  if(sessionCookie) {
    user = await auth.verifySessionCookie(sessionCookie);
  }

  const userId = user?.uid;

  if (!params.id || !userId) {
    return new Response("No se puede encontrar el ingreso o el usuario", {
      status: 404,
    });
  }

  try {
    const doc = await incomesRef.doc(params.id).get();
    if (!doc.exists || doc?.data()?.userId !== userId) {
      return new Response("No tienes permiso para eliminar este ingreso", {
        status: 403,
      });
    }

    await incomesRef.doc(params.id).delete();
  } catch (error) {
    return new Response("Algo salió mal", {
      status: 500,
    });
  }
  return redirect("/incomes");
};