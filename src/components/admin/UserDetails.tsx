import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, RowNode } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useGetUserList } from "../../tanstack/tanstack";
import type { UserType } from "../../types/userType";
import { useDeleteUser } from "../../tanstack/adminTanstack";
const UserDetails = () => {

    const { data, refetch } = useGetUserList();
    const [rowData, setRowData] = useState<any>([]);
    const [gridApi, setGridApi] = useState<any>(null);
    const deleteUserMutation = useDeleteUser();

    useEffect(() => {
        if (data) {
            // data is already an array of objects
            setRowData(data);
        }
    }, [data]);


    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            editable: true,
            filter: true,
            resizable: true,
            floatingFilter: true
        };
    }, []);

    const deleteSelected = () => {
        if (!gridApi) return;
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedIds = selectedNodes.map((node: RowNode) => (node.data as UserType).id);
        selectedIds.forEach((id: number | string) => {
            deleteUserMutation.mutate(id);
        });
        refetch(); // Refresh data after deletion
    };

    const [columnDefs] = useState([
        // { headerName: "ID", field: "id", checkboxSelection: true },
        { headerName: "Role", field: "role" },
        { headerName: "Email", field: "email" },
        { headerName: "First Name", field: "firstName" },
        { headerName: "Last Name", field: "lastName" },
        { headerName: "Alternate Email", field: "alternateEmailId" },
        { headerName: "City", field: "city" }

    ]);



    ModuleRegistry.registerModules([AllCommunityModule]);

    return (
        <>
            <button onClick={deleteSelected}>Delete Selected</button>

            <div className="ag-theme-quartz" style={{ height: 450 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    theme="legacy"
                    defaultColDef={defaultColDef}
                    rowSelection={"single"}
                    pagination={true}
                    paginationPageSize={15}
                    paginationPageSizeSelector={true}

                    onGridReady={(params) => {
                        setGridApi(params.api);

                        refetch();

                    }}


                />
            </div>
        </>
    )
}

export default UserDetails