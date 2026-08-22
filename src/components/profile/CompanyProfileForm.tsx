"use client"
import {useState, useEffect} from "react";
import {Building2, Link2, FileText, Loader2, Save} from "lucide-react";

export default function CompanyProfileForm() {
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetch("/api/user/company")
            .then(res => res.json())
            .then(data => {
                if (data.name) {
                    setName(data.name || "");
                    setWebsite(data.website || "");
                    setDescription(data.description || "");
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        if (!name.trim()) return;
        setSaving(true);
        setSuccessMessage("");

        try {
            const res = await fetch("/api/user/company", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, website, description})
            });
            if (res.ok) {
                setSuccessMessage("Company details saved successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        }
        catch (error) {
            console.error("Unable to save", error);
        }
        finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin"/>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in rounded-2xl">
            {/*<h3 className="text-l font-brand font-bold text-secondary mb-2">*/}
            {/*    Company Details*/}
            {/*</h3>*/}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-1">
                    <label htmlFor="companyName"
                           className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <Building2 className="w-4 h-4"/> Company Name *
                    </label>

                    <input
                        id="companyName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                        placeholder="e.g., Meta Inc., Apple Inc."
                    />
                </div>

                <div className="flex flex-col gap-2 md:col-span-1">
                    <label htmlFor="companyWebsite"
                           className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <Link2 className="w-4 h-4"/> Official Website
                    </label>
                    <input
                        id="companyWebsite"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-secondary/30"
                        placeholder="https://...."
                    />
                </div>

                <div className="flex flex-col gap-2 md:col-span-1">
                    <label htmlFor="companyDesc"
                           className="text-sm font-brand font-bold text-secondary/70 flex items-center gap-2 cursor-pointer">
                        <FileText className="w-4 h-4"/> Company Description
                    </label>

                    <textarea
                        id="companyDesc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all druation-300 placeholder:text-secondary/30 resize=none"
                        placeholder="What does your company do?"
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-between mt-4">
                <p className="text-green-500 font-brand font-bold text-sm animate-fade-in h-5">
                    {successMessage}
                </p>
                <button
                    onClick={handleSave}
                    disabled={saving || !name.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-brand font-bold rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50 shadow-lg"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                    Save Details
                </button>
            </div>
        </div>
    );
}