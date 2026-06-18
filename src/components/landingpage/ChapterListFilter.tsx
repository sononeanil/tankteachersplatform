import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getChapterNotes } from "../../service/ApiNotes";

// ... (Your TypeScript interfaces remain exactly the same) ...

const ChapterNotesSEOView = () => {
    const [searchParams] = useSearchParams();

    const currentSubject = searchParams.get("key") || "Class_9_Science";
    const chapterNumber = searchParams.get("chapter") || "Chapter 1";

    const {
        data: contentResponse,
        isFetching: contentLoading,
        error: queryError // Added to catch any network/API errors
    } = useQuery<any>({ // Temporarily cast as 'any' to make logging raw response easy
        queryKey: ["chapterContent", currentSubject, chapterNumber],
        queryFn: () => getChapterNotes({ key: currentSubject, chapter: chapterNumber }),
        enabled: !!currentSubject && !!chapterNumber,
        staleTime: 1000 * 60 * 20,
    });

    // 🔍 DEBUG LOGS SECTION
    console.log("=== SEO VIEW DEBUGGER ===");
    console.log("URL Params parsed:", { currentSubject, chapterNumber });
    console.log("Query Loading State:", contentLoading);
    console.log("Query Error (if any):", queryError);
    console.log("Raw API Response (contentResponse):", contentResponse);
    console.log("Extracted notes layer (contentResponse?.notes):", contentResponse?.notes);
    console.log("=========================");

    const data = contentResponse;

    if (contentLoading) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#4A5568", fontFamily: "sans-serif" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>🔄 Loading Materials</div>
                <p>Preparing professional revision notes and study mock-ups...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#E53E3E", fontFamily: "sans-serif" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>⚠️ Content Unavailable</div>
                <p>No revision material found for this specific chapter segment.</p>
                <small style={{ color: "#718096" }}>Check browser console for data structure logs.</small>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "system-ui, sans-serif", color: "#2D3748", lineHeight: "1.6" }}>

            {/* Header Section */}
            <header style={{ borderBottom: "2px solid #E2E8F0", paddingBottom: "20px", marginBottom: "30px" }}>
                <span style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "2px", color: "#718096", fontWeight: "bold" }}>
                    {currentSubject.replace(/_/g, " ")} — {chapterNumber}
                </span>
                <h1 style={{ fontSize: "32px", margin: "5px 0 0 0", color: "#1A202C" }}>Revision Suite & Notes</h1>
            </header>

            {/* Chapter Summary */}
            {data.summary && (
                <section style={{ backgroundColor: "#F7FAFC", borderLeft: "5px solid #4299E1", padding: "20px", borderRadius: "0 8px 8px 0", marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "20px", margin: "0 0 10px 0", color: "#2B6CB0" }}>📝 Chapter Executive Summary</h2>
                    <p style={{ margin: 0, color: "#4A5568", fontSize: "15px" }}>{data.summary}</p>
                </section>
            )}

            {/* Revision Cards Section */}
            <section style={{ marginBottom: "50px" }}>
                <h2 style={{ fontSize: "24px", borderBottom: "1px solid #E2E8F0", paddingBottom: "8px", marginBottom: "20px" }}>💡 Key Concepts & Core Notes</h2>
                <div style={{ display: "grid", gap: "25px" }}>
                    {(data.notes || []).map((item: any, index: number) => (
                        <div key={index} style={{ border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", padding: "20px", backgroundColor: "#FFF" }}>
                            <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#2D3748" }}>
                                <span style={{ color: "#4299E1", marginRight: "8px" }}>#{index + 1}</span> {item.note}
                            </h3>
                            <p style={{ color: "#4A5568", fontSize: "15px", marginBottom: "15px" }}>{item.explanation}</p>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
                                {(item.examKeywords || []).map((keyword: string, idx: number) => (
                                    <span key={idx} style={{ backgroundColor: "#EBF8FF", color: "#2B6CB0", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                                        🗝️ {keyword}
                                    </span>
                                ))}
                            </div>

                            {item.marksBoosterTip && (
                                <div style={{ backgroundColor: "#FEFCBF", border: "1px solid #FAF089", padding: "12px 15px", borderRadius: "6px", fontSize: "13px", color: "#744210" }}>
                                    <strong>🚀 Exam Marks Booster:</strong> {item.marksBoosterTip}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Concept Comparison Framework */}
            {data.vennDiagram && (
                <section style={{ marginBottom: "50px", backgroundColor: "#EDF2F7", padding: "25px", borderRadius: "12px" }}>
                    <h2 style={{ fontSize: "22px", textAlign: "center", marginBottom: "20px" }}>🔍 Comparative Framework</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                        <div style={{ backgroundColor: "#FFF", padding: "15px", borderRadius: "8px", borderTop: "4px solid #ED8936" }}>
                            <h4 style={{ margin: "0 0 10px 0", color: "#C05621" }}>{data.vennDiagram.conceptA}</h4>
                            <ul style={{ paddingLeft: "20px", fontSize: "13px", margin: 0 }}>
                                {(data.vennDiagram.uniqueA || []).map((val: string, i: number) => <li key={i} style={{ marginBottom: "6px" }}>{val}</li>)}
                            </ul>
                        </div>

                        <div style={{ backgroundColor: "#FFF", padding: "15px", borderRadius: "8px", borderTop: "4px solid #48BB78" }}>
                            <h4 style={{ margin: "0 0 10px 0", color: "#22543D" }}>Shared Features</h4>
                            <ul style={{ paddingLeft: "20px", fontSize: "13px", margin: 0 }}>
                                {(data.vennDiagram.common || []).map((val: string, i: number) => <li key={i} style={{ marginBottom: "6px" }}>{val}</li>)}
                            </ul>
                        </div>

                        <div style={{ backgroundColor: "#FFF", padding: "15px", borderRadius: "8px", borderTop: "4px solid #9F7AEA" }}>
                            <h4 style={{ margin: "0 0 10px 0", color: "#553C9A" }}>{data.vennDiagram.conceptB}</h4>
                            <ul style={{ paddingLeft: "20px", fontSize: "13px", margin: 0 }}>
                                {(data.vennDiagram.uniqueB || []).map((val: string, i: number) => <li key={i} style={{ marginBottom: "6px" }}>{val}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* Q&A Framework */}
            <section style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "24px", borderBottom: "1px solid #E2E8F0", paddingBottom: "8px", marginBottom: "20px" }}>❓ Textbook Q&A & Practice</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {(data.questions || []).map((q: any, idx: number) => (
                        <div key={idx} style={{ borderLeft: "4px solid #4A5568", paddingLeft: "15px", margin: "10px 0" }}>
                            <p style={{ fontWeight: "bold", margin: "0 0 8px 0", fontSize: "16px" }}>
                                {q.questionNumber ? `${q.questionNumber}: ` : `Practice Q: `} {q.question}
                            </p>

                            {q.options && q.options.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "10px 0 15px 0" }}>
                                    {(q.options || []).map((opt: string, i: number) => (
                                        <div key={i} style={{ padding: "8px 12px", border: "1px solid #CBD5E0", borderRadius: "4px", fontSize: "14px", backgroundColor: "#F7FAFC" }}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p style={{ color: "#2F855A", margin: 0, fontSize: "14px", backgroundColor: "#F0FFF4", padding: "10px", borderRadius: "4px" }}>
                                <strong>Answer:</strong> {q.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ChapterNotesSEOView;