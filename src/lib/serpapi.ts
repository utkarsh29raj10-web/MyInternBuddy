import {prisma} from "@/lib/prisma";
import crypto from "crypto";

interface SerpApiJob {
    job_id?: string;
    title: string;
    company_name: string;
    location: string;
    description: string;
    related_links?: {link: string; text: string}[];
    extensions?: string[];
}

function generateJobId(title: string, company: string, location: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(`${title.toLowerCase().trim()}|${company.toLowerCase().trim()}|${location.toLowerCase().trim()}`);
    return hash.digest("hex").slice(0, 24);
}

function parseExtensions(extensions: string[] = []) {
    let stipend: string | null = null;
    let duration: string | null = null;
    let postedAt: Date | null = null;

    const currencyRegex = /[\$€£¥₹]/;

    extensions.forEach((ext) => {
        const lowerExt = ext.toLowerCase();

        if (
            currencyRegex.test(lowerExt) ||
            lowerExt.includes("stipend") ||
            lowerExt.includes("unpaid") ||
            lowerExt.includes("/hr") ||
            lowerExt.includes("/month") ||
            lowerExt.includes("an hour")
        ) {
            stipend = ext;
        }
        else if (
            lowerExt.includes("month") ||
            lowerExt.includes("week") ||
            lowerExt.includes("day")
        ) {
            duration = ext;
        }

        else if (lowerExt.includes("ago")) {
            postedAt = new Date();
        }
    });

    return {stipend, duration, postedAt};
}

export async function fetchAndCacheGoogleJobs(query: string, location?: string) {
    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
        console.error("Missing Serp API Key");
        return [];
    }

    const searchParams = new URLSearchParams({
        engine: "google_jobs",
        q: `${query} internship`,
        api_key: apiKey,
    });

    if (location) {
        if (location.toLowerCase() === "remote") {
            searchParams.append("q", `${query} internship remote`);
        }
        else {
            searchParams.append("location", location);
        }
    }

    try {
        const response = await fetch(`https://serpapi.com/search.json?${searchParams.toString()}`);
        const data = await response.json();

        if (!data.jobs_results) {
            console.error("SerpAPI returned no jobs", data);
            return[];
        }

        const normalizedJobs = data.jobs_results.map((job: SerpApiJob) => {
            const {stipend, duration, postedAt} = parseExtensions(job.extensions);
            const applyLink = job.related_links && job.related_links.length > 0 ? job.related_links[0].link : "#";

            return {
                id: job.job_id || generateJobId(job.title, job.company_name, job.location),
                title: job.title,
                company: job.company_name,
                description: job.description,
                location: job.location,
                stipend,
                duration,
                startDate: null,
                skills: [],
                applyLink,
                sourcePlatform: job.related_links ? job.related_links[0].text : "Google Jobs",
                postedAt: postedAt,
                fetchedAt: new Date(),
            };
        });

        const upsertPromises = normalizedJobs.map((job: any) => prisma.internship.upsert({
            where: {id: job.id},
            update: {
                fetchedAt: new Date(),
            },
            create: job
        }));

        await prisma.$transaction(upsertPromises);
        return normalizedJobs;
    }
    catch (error) {
        console.error("Failed to fetch from SerpAPI:", error);
        return [];
    }
}
