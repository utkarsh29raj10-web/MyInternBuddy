"use client"
import {useState} from "react";
import {Briefcase, MapPin, Banknote, Clock, FileText, Tags, Loader2, ArrowRight, ArrowLeft, CheckCircle, X} from "lucide-react";

export default function RecruiterInternshipForm({onSuccess, initialData}: {onSuccess?: () => void, initialData?: any}) {
    const [step, setStep] = useState(1);

    const [title, setTitle] = useState(initialData?.title ||"");
    const [location, setLocation] = useState(initialData?.location ||"");
    const [stipend, setStipend] = useState(initialData?.stipend || "");
    const [duration, setDuration] = useState(initialData?.duration || "");
    const [description, setDescription] = useState(initialData?.description || "");

    const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
    const [skillInput, setSkillInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const trimmed = skillInput.trim();
            if (trimmed && !skills.includes(trimmed)) {
                setSkills([...skills, trimmed]);
                setSkillInput("");
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSubmit = async () => {
        if (!title || !location || !description) {
            setError("Title, Location and Description are mandatory.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const url = initialData
                ? `/api/internships/native/${initialData.id}`
                : "/api/internships/native";

            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, location, stipend, duration, description, skills})
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to post listing");
            }

            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
                setStep(1);
                setTitle("");
                setLocation("");
                setStipend("");
                setDuration("");
                setDescription("");
                setSkills([]);
                setSuccess(false);
            }, 5000);
        }
        catch (err: any) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full flex flex-col items-center justify-center gap-4 py-16 animate-fade-in bg-secondary/5 border border-secondary/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                <h3 className="text-xl font-brand font-bold text-secondary">
                    Internship Posted Successfully!
                </h3>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in bg-secondary/5 border border-secondary/10 rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-l font-brand font-bold text-secondary">
                  Create a New Listing
              </h3>
              <span className="text-sm font-sans font-bold text-secondary/50">
                  Step {step} of 2
              </span>
            </div>

            {error
              && <p className="text-red-500 text-sm font-bold animate-fade-in">
                  {error}
              </p>
            }

            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2">
                            <Briefcase className="w-4 h-4"/> Job Title *
                        </label>

                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                          placeholder="e.g. Marketing Intern"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2">
                            <MapPin className="w-4 h-4"/> Location *
                        </label>

                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                          placeholder="e.g. Remote, or New Delhi or New York"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2">
                          <Banknote className="w-4 h-4"/>
                          Compensation (Stipend/Salary)
                        </label>
                        <input
                          type="text"
                          value={stipend}
                          onChange={(e) => setStipend(e.target.value)}
                          className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                          placeholder="e.g. $1000/mo, Unpaid, Rs.500/hr"
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2">
                          <Clock className="w-4 h-4"/> Duration
                      </label>

                      <input
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                          placeholder="e.g. 3 Months, 1 Year"
                      />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2">
                          <FileText className="w-4 h-4"/> Full Description *
                        </label>

                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={6}
                          className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 resize-none"
                          placeholder="Describe the role, responsibilities and requirements"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2">
                            <Tags className="w-4 h-4"/> Required Skills (Press Enter to add)
                        </label>

                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={addSkill}
                            className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                            placeholder="e.g. React, Python"
                        />

                        {skills.length > 0 && (
                            <div className="w-full flex flex-wrap gap-2 mt-2">
                                {skills.map(skill => (
                                    <div key={skill}
                                        className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-bold animate-fade-in">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)}
                                                className="hover:text-red-400 transition-colors">
                                            <X className="w-3 h-3"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full flex items-center justify-between mt-4 pt-4 border-t border-secondary/10">
                {step === 1 ? (
                    <div className="ml-auto">
                        <button
                            onClick={() => setStep(2)}
                            disabled={!title || !location}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-brand font-bold rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50 shadow-lg"
                        >
                            Next Step
                            <ArrowRight className="w-4 h-4"/>
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary/10 text-secondary font-brand font-bold rounded-xl hover:bg-secondary/20 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4"/>
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !description}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-brand font-bold rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50 shadow-lg"
                        >
                            {loading
                                ? <Loader2 className="w-4 h-4 animate-spin"/>
                                : <CheckCircle className="w-4 h-4"/>
                            }
                            New Listing
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}