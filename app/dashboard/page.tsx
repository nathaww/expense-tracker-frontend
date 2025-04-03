import { cookies } from "next/headers";

const page = () => {
  const sessionCookie = cookies().get("sessionId")?.value;
  console.log(sessionCookie)
  return (
    <div className="h-screen">Dashboard</div>
  )
}

export default page