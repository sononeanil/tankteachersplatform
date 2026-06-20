import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getChapterNotes } from "../../service/ApiNotes";

const ChapterNotesSEOView = () => {
    const [searchParams] = useSearchParams();

    const currentSubject = searchParams.get("key") || "Class_9_Science";
    const chapterNumber = searchParams.get("chapter") || "Chapter 1";

    const {
        data: contentResponse,
        isFetching: contentLoading,
        error: queryError
    } = useQuery<any>({
        queryKey: ["chapterContent", currentSubject, chapterNumber],
        queryFn: () => getChapterNotes({ key: currentSubject, chapter: chapterNumber }),
        enabled: !!currentSubject && !!chapterNumber,
        staleTime: 1000 * 60 * 20,
    });

    const data = contentResponse;

    if (contentLoading) {
        return (
            <div style={{ textAlign: "center", padding: "100px 20px", color: "#0F172A", fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px" }}>🔄 Generating Smart Notes</div>
                <p style={{ color: "#334155", fontSize: "16px" }}>Assembling your interactive revision suite and flashcards...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ textAlign: "center", padding: "100px 20px", color: "#DC2626", fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div style={{ fontSize: "26px", fontWeight: "800", marginBottom: "10px" }}>⚠️ Space Empty</div>
                <p style={{ color: "#334155" }}>We couldn't locate revision materials for this specific chapter segment.</p>
            </div>
        );
    }

    // Design Tokens for Contrast and Pop
    const premiumShadow = "0 10px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px -1px rgba(15, 23, 42, 0.03)";
    const sleekBorder = "1px solid #CBD5E1"; // Darkened slightly for sharper container framing

    return (
        <div style={{ maxWidth: "950px", margin: "40px auto", padding: "30px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#0F172A", lineHeight: "1.65" }}>

            {/* Header Section */}
            <header style={{ backgroundColor: "#FFFFFF", padding: "35px", borderRadius: "20px", boxShadow: premiumShadow, border: "1px solid #CBD5E1", marginBottom: "35px" }}>
                <div style={{ display: "inline-block", backgroundColor: "#0284C7", color: "#FFFFFF", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                    📚 {currentSubject.replace(/_/g, " ")} — {chapterNumber}
                </div>
                <h1 style={{ fontSize: "36px", fontWeight: "900", margin: "0", color: "#0F172A", letterSpacing: "-0.5px" }}>
                    Revision Suite & Smart Notes
                </h1>
            </header>

            {/* Chapter Summary */}
            {data.summary && (
                <section style={{ backgroundColor: "#F0F9FF", borderLeft: "6px solid #0284C7", padding: "24px", borderRadius: "4px 20px 20px 4px", boxShadow: "0 8px 20px -8px rgba(2, 132, 199, 0.15)", marginBottom: "45px", borderTop: "1px solid #BAE6FD", borderRight: "1px solid #BAE6FD", borderBottom: "1px solid #BAE6FD" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 10px 0", color: "#0369A1", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>📝</span> Executive Chapter Brief
                    </h2>
                    <p style={{ margin: 0, color: "#1E293B", fontSize: "16px", fontWeight: "600" }}>{data.summary}</p>
                </section>
            )}

            {/* Revision Cards Section */}
            <section style={{ marginBottom: "55px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "850", color: "#0F172A", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>💡</span> Core High-Yield Concepts
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                    {(data.notes || []).map((item: any, index: number) => (
                        <div key={index} style={{ border: sleekBorder, borderRadius: "20px", boxShadow: premiumShadow, padding: "28px", backgroundColor: "#FFFFFF" }}>

                            {/* Card Title Header - Deep Dark Bold */}
                            <h3 style={{ margin: "0 0 14px 0", fontSize: "20px", fontWeight: "850", color: "#0F172A", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                <span style={{ backgroundColor: "#0F172A", color: "#FFFFFF", minWidth: "32px", height: "32px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "900" }}>
                                    {index + 1}
                                </span>
                                <span style={{ paddingTop: "2px" }}>{item.note}</span>
                            </h3>

                            {/* Card Explanation Body - Maximum High Contrast Text */}
                            <p style={{ color: "#1E293B", fontSize: "16px", fontWeight: "500", marginLeft: "44px", marginBottom: "20px" }}>{item.explanation}</p>

                            {/* Keywords / Tags Layout - Upgraded color vibrancy */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginLeft: "44px", marginBottom: "20px" }}>
                                {(item.examKeywords || []).map((keyword: string, idx: number) => (
                                    <span key={idx} style={{ backgroundColor: "#F0FDFA", color: "#0D9488", border: "1px solid #CCFBF1", padding: "6px 14px", borderRadius: "30px", fontSize: "13px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 4px rgba(13, 148, 136, 0.04)" }}>
                                        🔑 {keyword}
                                    </span>
                                ))}
                            </div>

                            {/* Marks Booster Tip Accent Banner */}
                            {item.marksBoosterTip && (
                                <div style={{ marginLeft: "44px", backgroundColor: "#FFFDF2", borderLeft: "5px solid #D97706", borderTop: "1px solid #FEF08A", borderRight: "1px solid #FEF08A", borderBottom: "1px solid #FEF08A", padding: "16px", borderRadius: "0 14px 14px 0", fontSize: "14.5px", color: "#451A03", fontWeight: "500" }}>
                                    <strong style={{ color: "#B45309", display: "inline-flex", alignItems: "center", gap: "4px", marginRight: "6px", fontWeight: "800" }}>
                                        🚀 Exam Marks Booster:
                                    </strong>
                                    {item.marksBoosterTip}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Concept Comparison Framework */}
            {data.vennDiagram && (
                <section style={{ marginBottom: "55px", backgroundColor: "#F8FAFC", border: sleekBorder, padding: "30px", borderRadius: "24px", boxShadow: premiumShadow }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "850", color: "#0F172A", textAlign: "center", marginBottom: "25px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span>🔍</span> Visual Framework Matrix
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>

                        {/* Concept A Card */}
                        <div style={{ backgroundColor: "#FFFFFF", padding: "22px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", borderTop: "6px solid #DC2626", borderLeft: sleekBorder, borderRight: sleekBorder, borderBottom: sleekBorder }}>
                            <h4 style={{ margin: "0 0 12px 0", color: "#991B1B", fontWeight: "850", fontSize: "16px" }}>{data.vennDiagram.conceptA}</h4>
                            <ul style={{ paddingLeft: "18px", fontSize: "14.5px", color: "#1E293B", fontWeight: "600", margin: 0 }}>
                                {(data.vennDiagram.uniqueA || []).map((val: string, i: number) => <li key={i} style={{ marginBottom: "8px" }}>{val}</li>)}
                            </ul>
                        </div>

                        {/* Shared Card */}
                        <div style={{ backgroundColor: "#FFFFFF", padding: "22px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", borderTop: "6px solid #16A34A", borderLeft: sleekBorder, borderRight: sleekBorder, borderBottom: sleekBorder }}>
                            <h4 style={{ margin: "0 0 12px 0", color: "#14532D", fontWeight: "850", fontSize: "16px" }}>Shared Commonalities</h4>
                            <ul style={{ paddingLeft: "18px", fontSize: "14.5px", color: "#1E293B", fontWeight: "600", margin: 0 }}>
                                {(data.vennDiagram.common || []).map((val: string, i: number) => <li key={i} style={{ marginBottom: "8px" }}>{val}</li>)}
                            </ul>
                        </div>

                        {/* Concept B Card */}
                        <div style={{ backgroundColor: "#FFFFFF", padding: "22px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", borderTop: "6px solid #7C3AED", borderLeft: sleekBorder, borderRight: sleekBorder, borderBottom: sleekBorder }}>
                            <h4 style={{ margin: "0 0 12px 0", color: "#4C1D95", fontWeight: "850", fontSize: "16px" }}>{data.vennDiagram.conceptB}</h4>
                            <ul style={{ paddingLeft: "18px", fontSize: "14.5px", color: "#1E293B", fontWeight: "600", margin: 0 }}>
                                {(data.vennDiagram.uniqueB || []).map((val: string, i: number) => <li key={i} style={{ marginBottom: "8px" }}>{val}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* Q&A Framework */}
            <section style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "850", color: "#0F172A", borderBottom: "2px solid #CBD5E1", paddingBottom: "12px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>❓</span> Textbook Board Q&A
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    {(data.questions || []).map((q: any, idx: number) => (
                        <div key={idx} style={{ backgroundColor: "#FFFFFF", padding: "26px", borderRadius: "20px", border: sleekBorder, boxShadow: premiumShadow }}>

                            {/* Question Row - Distinct Deep Dark text */}
                            <p style={{ fontWeight: "850", margin: "0 0 14px 0", fontSize: "17px", color: "#0F172A", display: "flex", gap: "8px" }}>
                                <span style={{ color: "#0284C7" }}>{q.questionNumber ? `${q.questionNumber}.` : `Q:`}</span>
                                <span>{q.question}</span>
                            </p>

                            {/* Options Layout */}
                            {q.options && q.options.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", margin: "16px 0" }}>
                                    {(q.options || []).map((opt: string, i: number) => (
                                        <div key={i} style={{ padding: "12px 16px", border: sleekBorder, borderRadius: "12px", fontSize: "14.5px", fontWeight: "600", backgroundColor: "#F8FAFC", color: "#1E293B" }}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Answer Box Wrapper - High contrast text layout */}
                            <div style={{ color: "#064E3B", margin: "14px 0 0 0", fontSize: "15px", fontWeight: "600", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "14px 18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: "900", letterSpacing: "0.5px", color: "#166534" }}>✅ Ideal Solution</span>
                                <div>{q.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ChapterNotesSEOView;