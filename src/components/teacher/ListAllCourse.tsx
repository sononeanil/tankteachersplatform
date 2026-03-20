import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { usePublishCourseList } from "../../tanstack/publishCoursesTanstack";
import type { PublishCourseType } from "../../types/publishCourseTypes";
import { AllCommunityModule, ModuleRegistry, type ColDef } from "ag-grid-community";
import { useNavigate } from "react-router-dom";


const ListAllCourse = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = usePublishCourseList();
    const columnDefs: ColDef<PublishCourseType>[] = [
        {
            headerName: "Register",
            cellRenderer: (params: any) => (
                <button
                    style={{ color: "blue", textDecoration: "underline" }}
                    onClick={() =>
                        navigate(`/login?courseId=${params.data.id}`)
                    }
                >
                    Register
                </button>
            )
        },
        { headerName: "ID", field: "id", hide: true },
        { headerName: "Course Name", field: "courseName", sortable: true, filter: true },
        { headerName: "Topic", field: "specificTopic", filter: true },
        { headerName: "Teachers Email", field: "organizerEmailId", filter: true },
        { headerName: "Start Time", field: "batchStartTime" },
        { headerName: "Days", field: "numberOfDays" },
        { headerName: "Hours", field: "numberOfHourse" },
        { headerName: "Mode", field: "modeOfDelivery", filter: true },
        { headerName: "Fee", field: "fee" },
        { headerName: "Prerequisite", field: "prerequisite" },

    ];

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>{(error as Error).message}</p>;
    ModuleRegistry.registerModules([AllCommunityModule]);
    return (
        <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
        >
            <AgGridReact
                rowData={data}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={5}
            />
        </div>
    )
}

export default ListAllCourse