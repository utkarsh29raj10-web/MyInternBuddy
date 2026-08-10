"use client"
import {useState, useEffect} from "react";
import {User, GraduationCap, Tags, Loader2, CheckCircle2, X} from "lucide-react";

export default function ProfileDetailsForm() {
    const [name, setName] = useState("");
    const [college, setCollege] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (data.name) setName(data.name);
                if (data.college) setCollege(data.college);
                if (data.skills) setSkills(data.skills);
                setLoading(false);
            });
    }, []);

    const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSave = async() => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, college, skills})
            });
            if (res.ok) {
                setMessage({type: "success", text: "Details Saved"});
                setTimeout(() => setMessage(null), 3000);
            }
            else {
                setMessage({type: "error", text: "Failed to save"});
            }
        }
        catch (error) {
            setMessage({type: "error", text: "Network Error"});
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
        <div className="w-full flex flex-col gap-6 animate-fade-in bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-brand font-bold text-secondary mb-2">
                Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4"/> Full Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-background/50 border border-white/10 px-4 rounded-xl text-secondary focus:oultine-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                        placeholder="John Doe"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="college" className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <GraduationCap className="w-4 h-4"/>
                        University/College
                    </label>

                    <input
                        id="college"
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full bg-background/50 border border-white/10 px-6 rounded-md text-secondary focus:oultine-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                        placeholder="Hogwarts University"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="skills" className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                    <Tags className="w-4 h-4"/>
                    Skills (Press Enter to add)
                </label>

                <div className="w-full bg-background/50 border border-white/10 rounded-xl flex flex-wrap gap-2 transition-all duration-300">
                    {skills.map(skill => (
                        <div
                            key={skill}
                            className="flex items-center gap-1 bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full text-sm font-bold animate-fade-in"
                        >
                            {skill}
                            <button
                                onClick={() => removeSkill(skill)}
                                className="hover:text-white transition-colors"
                            >
                                <X className="w-3 h-3"/>
                            </button>
                        </div>
                    ))}

                    <input
                        id="skills"
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                        className="flex-grow bg-transparent border-none outline-none text-secondary min-w-[120px] placeholder:text-secondary/30 px-2"
                        placeholder="e.g., React, Python, Advertising"
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-end gap-4 mt-2">
                {message && (
                    <span className={`text-sm font-bold flex items-center gap-1 animate-fade-in ${message.type === "success" ? "text-green-400" : 'text-red-400'}`}>
                        {message.type === 'success' && <CheckCircle2 className="w-4 h-4"/>}
                        {message.text}
                    </span>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-background font-brand font-bold px-8 py-3 rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                >
                    {saving && <Loader2 className="w-4 h-4 animate-spin"/>}
                    Save Details
                </button>
            </div>
        </div>
    );
}
