"use client"
import {useState} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from "@hello-pangea/dnd";
import {User, Briefcase} from "lucide-react";

// Creating mock data to test UI
const INITIAL_DATA = {
    columns: {
        "pending": {
            id: "pending",
            title: "Pending Review",
            applicantIds: ["app-1", "app-2"]
        },
        "interviewing": {
            id: "interviewing",
            title: "Interviewing",
            applicantIds: ["app-3"]
        },
        "accepted": {
            id: "accepted",
            title: "Offered",
            applicantIds: []
        },
        "rejected": {
            id: "rejected",
            title: "Rejected",
            applicantIds: []
        },
    },
    applicants: {
        "app-1": {
            id: "app-1",
            name: "Son of Zeus",
            role: "Frontend Developer Intern",
            date: "Applied 2 Days Ago"
        },
        "app-2": {
            id: "app-2",
            name: "Zeus Himself",
            role: "Associative Clerical Intern",
            date: "Applied 5 days Ago"
        },
        "app-3": {
            id: "app-3",
            name: "Thor",
            role: "Graphic Design Intern",
            date: "Applied 1 hour ago"
        },
    },
    columnOrder: ["pending", "interviewing", "accepted", "rejected"]
};

export default function ApplicantBoard() {
    const [data, setData] = useState(INITIAL_DATA);

    const onDragEnd = (result: DropResult) => {
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
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full bg-secondary/5 border border-secondary/10 rounded-2xl p-6">
                <div>
                    <h3 className="text-xl font-brand font-bold text-secondary mb-1">
                        Applicant Management
                    </h3>
                    <p className="text-sm font-sans text-secondary/60">
                        Drag and Drop Applicants
                    </p>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4 min-h-125">
                    {data.columnOrder.map(columnId => {
                        const column = data.columns[columnId as keyof typeof data.columns];
                        const applicants = column.applicantIds.map(id => data.applicants[id as keyof typeof data.applicants]);

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

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 p-4 flex flex-col gap-3 transition-colors ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
                                        >
                                            {applicants.map((app, index) => (
                                                <Draggable key={app.id}
                                                    draggableId={app.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-background border border-secondary/10 p-4 rounded-xl shadow-sm transition-all duration-200 ${snapshot.isDragging ? "shadow-xl scale-105 border-primary/30 rotate-2" : "hover:border-secondary/30"}`}
                                                        >
                                                            <h5 className="font-brand font-bold text-primary flex items-center gap-2">
                                                                <User className="w-3.5 h-3.5 text-secondary/50"/>
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
        </div>
    );
}