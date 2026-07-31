import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import StudentProfile from "@/components/profile/StudentProfile";
import RecruiterProfile from "@/components/profile/RecruiterProfile";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role === "RECRUITER") {
        return <RecruiterProfile />;
    }

    return <StudentProfile />;
}