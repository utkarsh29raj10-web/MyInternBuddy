import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import LandingPage from "@/components/home/LandingPage";
import StudentHome from "@/components/home/StudentHome";
import RecruiterHome from "@/components/home/RecruiterHome";
import {redirect} from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if(!session)
        return <LandingPage />;

    const isNotOnboarded = session?.user?.onboarded === false;

    if (isNotOnboarded)
        redirect("/onboarding");

    if (role === "RECRUITER")
        return <RecruiterHome />;

    return <StudentHome/>
}