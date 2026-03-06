import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { delteCustomer, getCustomerList } from "../Api";
import type { customer } from "../types/postType";

const columhelper = createColumnHelper<customer>()

const columns: ColumnDef<customer>[] = [
    {
        accessorKey: "id",
        header: "ID"
    },
    {
        accessorKey: "name",
        header: "name"
    }, {
        accessorKey: "phonenumber",
        header: "phonenumber"
    },
    {
        accessorKey: "budget",
        header: "budget"
    },
    {
        accessorKey: "location",
        header: "location"
    },
    {
        accessorKey: "specification",
        header: "specification"
    },
    {
        accessorKey: "delete",
        header: "delete Item"
    },
    columhelper.display({
        id: "action",
        header: "actions",
        cell: ({ row }) => <DeleteButton id={row.original.id} />

    })

];

const DeleteButton = ({ id }: { id: number }) => {
    const queryClient = useQueryClient();
    const deleteClientMutation = useMutation({
        mutationFn: async (customerId: number) => delteCustomer(customerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getCustomerList"] });
        },
    });

    return <button onClick={() => deleteClientMutation.mutate(id)}>Delete Item</button>;
};


const TanstackTable = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["getCustomerList"],
        queryFn: () => getCustomerList(),

    });

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    if (isLoading) {
        return <div>.....Loading</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TanstackTable