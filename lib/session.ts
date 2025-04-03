import { cookies } from "next/headers";

// Session type - adjust based on what your NestJS backend provides
export type Session = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isVerified: boolean;
};

// Get the current session
export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get("connect.sid")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const response = await fetch(
      "https://expense-tracker-backend-csxl.onrender.com/auth/me",
      {
        headers: {
          Cookie: `connect.sid=${sessionCookie}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to validate session:", error);
    return null;
  }
}
