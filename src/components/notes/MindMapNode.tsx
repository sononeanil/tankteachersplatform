export const MindMapNode = ({ node, level = 0 }: any) => {
    const isHeading = (text: string) => /^\d+(\.\d+)*\s/.test(text);
    const isTitle = isHeading(node.name);

    const colors = ["#3182ce", "#38a169", "#805ad5", "#dd6b20"];

    return (
        <div style={{
            marginLeft: level * 20,
            marginTop: 8
        }}>
            {/* 🎯 Heading Node */}
            {isTitle ? (
                <div
                    style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        background: colors[level % colors.length],
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "bold"
                    }}
                >
                    {node.name}
                </div>
            ) : (
                /* 📌 Description Node */
                <div style={{
                    marginLeft: "10px",
                    fontSize: "13px",
                    color: "#444"
                }}>
                    • {node.name}
                </div>
            )}

            {/* 🌳 Children */}
            {node.children?.map((child: any, i: number) => (
                <MindMapNode key={i} node={child} level={level + 1} />
            ))}
        </div>
    );
};