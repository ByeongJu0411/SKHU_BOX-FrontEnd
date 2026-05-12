/*
 * ✅ 인증된 API 호출 유틸
 *
 * 1. accessToken을 헤더에 자동 포함
 * 2. 401 응답 시 refreshToken으로 토큰 갱신
 * 3. 갱신 성공하면 원래 요청 자동 재시도
 * 4. 갱신도 실패하면 로그인 페이지로 이동
 */

function getCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = getCookie("accessToken");

  // 1. accessToken으로 요청
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  // 2. 401이 아니면 그대로 반환
  if (res.status !== 401) return res;

  // 3. 401이면 refreshToken으로 갱신 시도
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) {
    // refreshToken도 없으면 로그인으로
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("role");
    window.location.href = "/login";
    return res;
  }

  const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const refreshData = await refreshRes.json();

  if (!refreshData.success) {
    // 갱신 실패 → 로그인으로
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("role");
    window.location.href = "/login";
    return res;
  }

  // 4. 새 토큰 저장
  setCookie("accessToken", refreshData.data.accessToken);
  setCookie("refreshToken", refreshData.data.refreshToken);

  // 5. 원래 요청 재시도
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshData.data.accessToken}`,
      ...options.headers,
    },
  });
}
