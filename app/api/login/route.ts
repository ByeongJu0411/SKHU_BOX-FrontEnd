export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!data.success) return Response.json({ success: false, message: data.message }, { status: 401 });

  const response = Response.json({ success: true, role: data.data.role });
  response.headers.set(
    "Set-Cookie",
    `accessToken=${data.data.accessToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`,
  );
  return response;
}
