import MentorRegisterWizard from "@/components/auth/MentorRegisterWizard";
import AlreadyLoggedIn from "@/components/auth/AlreadyLoggedIn";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function MentorRegisterPage() {
    const session = await auth();

    // If already logged in, show helpful message instead of blind redirect
    if (session && session.user) {
        if (session.user.role === "MENTOR") {
            // Already a mentor, go to dashboard
            redirect("/mentor");
        } else {
            // Logged in as student, show message
            return (
                <AlreadyLoggedIn
                    userName={session.user.name || "there"}
                    currentRole="STUDENT"
                    targetRole="MENTOR"
                    dashboardLink="/student"
                />
            );
        }
    }

    return (
        <div>
            <MentorRegisterWizard />
        </div>
    );
}
