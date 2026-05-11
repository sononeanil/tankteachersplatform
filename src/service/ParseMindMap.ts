export const parseMindMap = (mermaidText: string) => {
    if (!mermaidText) return { name: "No Data", children: [] };

    // 1. Clean the string: remove the "mindmap" keyword and empty lines
    const lines = mermaidText
        .split("\n")
        .filter((line) => line.trim() !== "" && !line.trim().startsWith("mindmap"));

    if (lines.length === 0) return { name: "Root", children: [] };

    const root: any = { name: "", children: [] };
    const stack: { node: any; indent: number }[] = [];

    lines.forEach((line) => {
        // 2. Calculate indentation level
        const indent = line.search(/\S/);
        // 3. Clean node name (remove Mermaid shapes like (( )) or [ ] or {{ }})
        const name = line.trim().replace(/[()\[\]{}]+/g, "");

        const newNode = { name, children: [] };

        if (stack.length === 0) {
            root.name = name;
            stack.push({ node: root, indent });
        } else {
            // Find the parent: pop the stack until we find a node with less indentation
            while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
                stack.pop();
            }

            if (stack.length > 0) {
                stack[stack.length - 1].node.children.push(newNode);
            }
            stack.push({ node: newNode, indent });
        }
    });

    return root;
};