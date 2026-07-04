import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const router = useRouter();

<button
  onClick={async () => {
    await signOut({ redirect: false });
    router.push("/login");
  }}
  className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
>
  Sign out
</button>
