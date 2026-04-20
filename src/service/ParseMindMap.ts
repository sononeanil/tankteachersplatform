export const parseMindMap = (text: string) => {
    const lines = text.split("\n").filter(Boolean);

    const root: any = { name: "Root", children: [] };
    const stack: any[] = [{ indent: -1, node: root }];

    let lastNode: any = null;

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (!trimmed || trimmed === "mindmap") return;

        const indent = line.search(/\S/);

        // 🧠 Detect heading (starts with number like 3.1, 3.1.1 etc.)
        const isHeading = /^\d+(\.\d+)*\s/.test(trimmed);

        if (isHeading) {
            const newNode = { name: trimmed, children: [] };

            while (stack.length && indent <= stack[stack.length - 1].indent) {
                stack.pop();
            }

            stack[stack.length - 1].node.children.push(newNode);
            stack.push({ indent, node: newNode });

            lastNode = newNode;
        } else {
            // 📌 Treat as description → attach to last node
            if (lastNode) {
                lastNode.children.push({
                    name: trimmed,
                    children: []
                });
            }
        }
    });

    return root;
};