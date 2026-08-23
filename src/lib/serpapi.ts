// fixed infinite scroll using AI
// fixed a second time using AI. this time, I didn't just take help but the actual codes too.

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

export async function fetchAndCacheGoogleJobs(query: string, location?: string, employmentType: string = "Internship", pageToken?: string) {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) return { jobs: [], nextPageToken: null };

    const cleanQuery = query.toLowerCase().replace(/internship|part time|full time|apprenticeship/g,"").trim();
    const finalQuery = `${cleanQuery} ${employmentType}`.trim();

    const isRemote = location?.toLowerCase().includes("remote");
    const locationParam = location && !isRemote
        ? `&location=${encodeURIComponent(location)}}`
        : '&gl=us'
    const ltypeParam = isRemote ? "&ltype=1" : "";

    let currentUrl: string = pageToken
        ? `${pageToken}&api_key=${apiKey}`
        : `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(finalQuery)}&api_key=${apiKey}${locationParam}${ltypeParam}`;

    let normalizedJobs: any[] = [];
    let lastNextToken: string | null = null;

    try {
        const res = await fetch(currentUrl);
        const apiData: any = await res.json();

        if (!apiData.jobs_results && apiData.jobs_results.length > 0) {
            normalizedJobs = apiData.jobs_results.map((job: any) => {
                const {stipend, duration, postedAt} = parseExtensions(job.extensions);
                let applyLink = "#";
                let sourcePlatform = job.via ? job.via.replace("via", "") : "Google Jobs";

                if (job.apply_options && job.apply_options.length > 0) {
                    applyLink = job.apply_options[0].link;
                    sourcePlatform = job.apply_options[0].title.replace("Apply on ", "");
                } else if (job.related_links && job.related_links.length > 0) {
                    applyLink = job.related_links[0].link;
                } else if (job.share_link) {
                    applyLink = job.share_link;
                }
                return {
                    id: job.job_id || generateJobId(job.title, job.company_name, job.location),
                    title: job.title,
                    company: job.company_name,
                    description: job.description,
                    location: job.location,
                    stipend,
                    duration,
                    employmentType, // Map to our new database column
                    startDate: null,
                    skills: [],
                    applyLink,
                    sourcePlatform,
                    postedAt: postedAt,
                    fetchedAt: new Date(),
                };
            });
            // Extract the EXACT pagination URL for the next infinite scroll batch
            if (apiData.serpapi_pagination && apiData.serpapi_pagination.next) {
                lastNextToken = apiData.serpapi_pagination.next;
            }
        }
    } catch (error) {
        console.error(`[SERPAPI] Failed to fetch:`, error);
        return { jobs: [], nextPageToken: null };
    }
    if (normalizedJobs.length === 0) return { jobs: [], nextPageToken: null };
    // Instantly cache the new page of results to Prisma
    try {
        const upsertPromises = normalizedJobs.map((job: any) =>
            prisma.internship.upsert({
                where: { id: job.id },
                update: { fetchedAt: new Date() },
                create: job
            })
        );
        await Promise.all(upsertPromises);
    } catch (dbError) {
        console.error("[SERPAPI] Database upsert failed:", dbError);
    }
    return {
        jobs: normalizedJobs,
        nextPageToken: lastNextToken
    };
}