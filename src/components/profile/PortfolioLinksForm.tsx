"use client"
import {useState, useEffect} from "react";
import {Link2, GitBranch, Briefcase, FileText, Loader2, CheckCircle2} from "lucide-react";

export default function PortfolioLinksForm() {
    const [resumeUrl, setResumeUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [portfolioUrl, setPortfolioUrl] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (data.resumeUrl) setResumeUrl(data.resumeUrl);
                if (data.githubUrl) setGithubUrl(data.girhubUrl);
                if (data.linkedinUrl) setLinkedinUrl(data.linkedinUrl);
                if (data.portfolioUrl) setPortfolioUrl(data.portfolioUrl);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({resumeUrl, githubUrl, linkedinUrl, portfolioUrl})
            });
            if (res.ok) {
                setMessage({type: "success", text: "Links saved"});
                setTimeout(() => setMessage(null), 3000);
            }
            else {
                setMessage({type: "error", text: "Failed to save"});
            }
        }
        catch (error) {
            setMessage({type: 'error', text: "Network error"});
        }
        finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="w-full h-32 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin"/>
        </div>
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in border border-secondary/10 rounded-2xl p-6 md:p-8 mt-6">
            <h3 className="text-l font-brand font-bold text-secondary mb-2">
                Portfolio & Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="resume" className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <FileText className="w-4 h-4"/>
                        Resume URL
                    </label>

                    <input
                        id="resume"
                        type="url"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                        placeholder="https://...."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="github" className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <GitBranch className="w-4 h-4"/>
                        GitHub/Equivalent Profile
                    </label>

                    <input
                        id="github"
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                        placeholder="https://github.com/..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="linkedin" className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2">
                        <Briefcase className="w-4 h-4"/>
                        LinkedIn Profile
                    </label>

                    <input
                        id="linkedin"
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                        placeholder="https://linkedin.com/in/..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="portfolio" className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <Link2 className="w-4 h-4" /> Personal Portfolio
                    </label>
                    <input
                        id="portfolio"
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none foucs:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 palceholder:text-secondary/30"
                        placeholder="https://..."
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-end gap-4 mt-2">
                {message && (
                    <span className={`text-sm font-bold flex items-center gap-1 animate-fade-in ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {
                            message.type === 'success' &&
                            <CheckCircle2 className="w-4 h-4"/>
                        }
                        {message.text}
                    </span>
                )}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-background font-brand font-bold px-8 py-3 rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                >
                    {
                        saving &&
                        <Loader2 className="w-4 h-4 animate-spin"/>
                    }
                    Save Links
                </button>
            </div>
        </div>
    );
}