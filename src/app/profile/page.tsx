import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import StudentProfile from "@/components/profile/StudentProfile";
import RecruiterProfile from "@/components/profile/RecruiterProfile";
import {Suspense} from "react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role === "RECRUITER") {
        return (
            <Suspense fallback={
              <div className="w-full text-center text-secondary py-10 font-sans font-bold">
                  Loading Recruiter Profile
              </div>
            }>
                <RecruiterProfile/>
            </Suspense>
        );
    }

    return (
        <Suspense fallback={
            <div className="w-full text-center text-secondary py-10 font-sans font-bold">
                Loading Student Profile
            </div>
        }>
            <StudentProfile/>
        </Suspense>
    );
}