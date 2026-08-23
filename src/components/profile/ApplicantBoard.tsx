"use client"
import {useState, useEffect} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from "@hello-pangea/dnd";
import {User, Briefcase, Loader2, ExternalLink, ChevronDown} from "lucide-react";
import {useSearchParams} from "next/navigation";

// Creating mock data to test UI -> Now real
export default function ApplicantBoard() {
    const searchParams = useSearchParams();
    const queryJobId = searchParams.get("jobId");

    const [allInternships, setAllInternships] = useState<any[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<string>(queryJobId || "ALL");

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch("/api/applications/native");
                const result = await res.json();
                if (result.success)
                    setAllInternships(result.internships);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    useEffect(() => {
        const columns = {
            "PENDING": {
                id: "PENDING",
                title: "Pending Review",
                applicantIds: [] as string[]
            },
            "INTERVIEWING": {
                id: "INTERVIEWING",
                title: "Interviewing",
                applicantIds: [] as string[]
            },
            "ACCEPTED": {
                id: "ACCEPTED",
                title: "Offered",
                applicantIds: [] as string[]
            },
            "REJECTED": {
                id: "REJECTED",
                title: "Rejected",
                applicantIds: [] as string[]
            },
        };
        const applicantsMap: any = {};

        if (allInternships.length > 0) {
            const filteredInternships = selectedJobId === "ALL"
                ? allInternships
                : allInternships.filter(i => i.id === selectedJobId);

            filteredInternships.forEach((internship: any) => {
                internship.applications.forEach((app: any) => {
                    const status = app.status || "PENDING";
                    if (columns[status as keyof typeof columns])
                        columns[status as keyof typeof columns].applicantIds.push(app.id);

                    applicantsMap[app.id] = {
                        id: app.id,
                        name: app.student.name || "Unknown Applicant",
                        role: internship.title,
                        date: new Date(app.appliedAt).toLocaleDateString(),
                        coverLetter: app.coverLetter,
                        resumeLink: app.student.resumeLink || app.student.resumeUrl,
                        email: app.student.email
                    };
                });
            });
        }
        setData({columns, applicants: applicantsMap, columnOrder: ["PENDING", "INTERVIEWING", "ACCEPTED", "REJECTED"]});
    }, [allInternships, selectedJobId]);

    const onDragEnd = async (result: DropResult) => {
        const {destination, source, draggableId} = result;

        if (!destination)
            return;

        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        const startCol = data.columns[source.droppableId as keyof typeof data.columns];
        const endCol = data.columns[destination.droppableId as keyof typeof data.columns];

        if (startCol === endCol) {
            const newApplicantIds = Array.from(startCol.applicantIds);
            newApplicantIds.splice(source.index, 1);
            newApplicantIds.splice(destination.index, 0, draggableId);

            setData({
                ...data,
                columns: {
                    ...data.columns,
                    [startCol.id]: {
                        ...startCol,
                        applicantId: newApplicantIds
                    }
                }
            });
            return;
        }

        const startApplicantIds = Array.from(startCol.applicantIds);
        startApplicantIds.splice(source.index, 1);

        const endApplicantIds = Array.from(endCol.applicantIds);
        endApplicantIds.splice(destination.index, 0, draggableId);

        setData({
            ...data,
            columns: {
                ...data.columns,
                [startCol.id]: {
                    ...startCol,
                    applicantIds: startApplicantIds
                },
                [endCol.id]: {
                    ...endCol,
                    applicantIds: endApplicantIds
                }
            }
        });

        try {
            await fetch("/api/applications/native", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({applicationId: draggableId, status: endCol.id})
            });
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                {/*<div>*/}
                    {/*<h3 className="text-l font-brand font-bold text-secondary mb-1">*/}
                    {/*    Applicant Management*/}
                    {/*</h3>*/}
                    <p className="text-sm font-sans text-secondary/80">
                        Use Drag and Drop to manage applicant status.
                    </p>
                {/*</div>*/}

                <div className="relative">
                    <select
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="appearance-none bg-background border border-secondary/20 text-primary text-s font-bold font-sans rounded-xl pl-4 pr-12 min-w-40 py-2 outline-none focus:border-primary/50 cursor-pointer"
                    >
                        <option value="ALL">
                            All Listings
                        </option>

                        {allInternships.map(job => (
                            <option key={job.id}
                                value={job.id}
                            >
                                {job.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                </div>
            </div>

            {loading || !data ? (
                <div className="w-full flex justify-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50"/>
                </div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 overflow-x-auto pb-4 min-h-125">
                        {data.columnOrder.map((columnId: string) => {
                            const column = data.columns[columnId as keyof typeof data.columns];
                            const applicants = column.applicantIds.map((id: string) => data.applicants[id as keyof typeof data.applicants]);

                            return (
                                <div key={column.id}
                                    className="flex flex-col shrink-0 w-72 bg-secondary/5 rounded-2xl border border-secondary/10 overflow-hidden">
                                    <div className="p-4 border=b border-secondary/10 bg-background/50 flex justify-between items-center">
                                        <h4 className="font-brand font-bold text-secondary">
                                            {column.title}
                                        </h4>
                                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-bold">
                                            {applicants.length}
                                        </span>
                                    </div>

                                    <Droppable
                                        droppableId={column.id}
                                        renderClone={(provided, snapshot, rubric) => {
                                            const app = data.applicants[rubric.draggableId as keyof typeof data.applicants];
                                            return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={provided.draggableProps.style}
                                                    className="bg-background border border-primary/50 p-4 rounded-xl shadow-2xl"
                                                >
                                                    <h5 className="font-brand font-bold text-primary flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5 text-secondary opacity-50"/>
                                                        {app.name}
                                                    </h5>
                                                    <p className="text-xs font-sans text-secondary/70 mt-2 flex items-center gap-1.5">
                                                        <Briefcase className="w-3 h-3"/>
                                                        {app.role}
                                                    </p>
                                                    <p className="text-xs text-secondary/40 mt-3 border-t border-secondary/5 pt-2">
                                                        {app.date}
                                                    </p>
                                                </div>
                                            );
                                        }}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex-1 p-4 flex flex-col gap-3 transition-colors ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
                                            >
                                                {applicants.map((app: any, index: number) => (
                                                    <Draggable key={app.id}
                                                        draggableId={app.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={provided.draggableProps.style}
                                                                className={`bg-background border p-4 rounded-xl shadow-sm transition-shadow ${snapshot.isDragging ? "shadow-xl scale-105 border-primary/50 bg-background/90" : "border-secondary/10 hover:border-secondary/30"}`}
                                                            >
                                                                <h5 className="font-brand font-bold text-primary flex items-center gap-2">
                                                                    <User className="w-3.5 h-3.5 text-secondary/50"/>
                                                                    {app.name}
                                                                </h5>
                                                                <p className="text-xs font-sans text-secondary/70 mt-2 flex items-center gap-1.5">
                                                                    <Briefcase className="w-3 h-3"/>
                                                                    {app.role}
                                                                </p>

                                                                {app.resumeLink && (
                                                                    <a href={app.resumeLink}
                                                                       target="_blank"
                                                                       rel="noopener noreferrer"
                                                                       className="flex items-center gap-1 text-xs font-sans font-bold text-primary opacity-60 hover:opacity-100 transition-opacity mt-4 bg-secondary/5 w-max px-2 py-1 rounded-md">
                                                                        View Resume
                                                                        <ExternalLink className="w-3 h-3"/>
                                                                    </a>
                                                                )}

                                                                <p className="text-xs text-secondary/40 mt-3 border-t border-secondary/5 pt-2">
                                                                    Applied on {app.date}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </DragDropContext>
            )}
        </div>
    );
}