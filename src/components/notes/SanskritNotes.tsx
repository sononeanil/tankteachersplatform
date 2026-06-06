import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { getChapterList, getChapterNotes } from "../../service/ApiNotes";

// --- Tab Types Definition ---
type TabType = "explanations" | "grammar_vocab" | "questions" | "textbook";

const SanskritNotes = () => {
    const [activeChapter, setActiveChapter] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>("explanations");

    const params = useParams<Record<string, string>>();
    const rawParam = params.type || params.id || "";
    const decodedType = useMemo(() => (rawParam ? decodeURIComponent(rawParam) : ""), [rawParam]);

    // --- Query 1: Fetch Chapter List ---
    const { data: dropdownData, isLoading: dropdownLoading } = useQuery<any>({
        queryKey: ["chapters", decodedType],
        queryFn: () => {
            if (!decodedType) throw new Error("Route parameter key is missing.");
            return getChapterList({ key: decodedType });
        },
        enabled: !!decodedType,
        staleTime: Infinity,
    });

    const chapters = useMemo<string[]>(() => {
        if (!dropdownData) return [];
        if (Array.isArray(dropdownData)) return dropdownData;
        if (dropdownData.lstChapters && Array.isArray(dropdownData.lstChapters)) return dropdownData.lstChapters;
        if (dropdownData.data?.lstChapters && Array.isArray(dropdownData.data.lstChapters)) return dropdownData.data.lstChapters;
        return [];
    }, [dropdownData]);

    useEffect(() => {
        if (chapters.length > 0 && !activeChapter) {
            setActiveChapter(chapters[0]);
        }
    }, [chapters, activeChapter]);

    // --- Query 2: Fetch Sanskrit Notes Payload ---
    const { data: contentResponse, isFetching: contentLoading } = useQuery<any>({
        queryKey: ["chapterContent", decodedType, activeChapter],
        queryFn: () => getChapterNotes({ key: decodedType, chapter: activeChapter }),
        enabled: !!decodedType && !!activeChapter,
        staleTime: 1000 * 60 * 20,
    });
    console.log("Fetched Sanskrit Notes Response:", contentResponse);

    // --- Safe Extraction of the Notes Array ---
    const notesList = useMemo<any[]>(() => {
        // 1. Check if 'notes' is a direct array at the root level
        if (contentResponse?.notes && Array.isArray(contentResponse.notes)) {
            return contentResponse.notes;
        }
        // 2. Fallback check if Axios wrapped it inside a 'data' key
        if (contentResponse?.data?.notes && Array.isArray(contentResponse.data.notes)) {
            return contentResponse.data.notes;
        }
        return [];
    }, [contentResponse]);

    // --- Safe Extraction of Chapter Summary ---
    const chapterSummary = useMemo<string>(() => {
        return contentResponse?.notes?.summary || contentResponse?.data?.notes?.summary || "";
    }, [contentResponse]);

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "'Noto Sans', sans-serif", color: "#2d3748" }}>

            {/* Header / Selector Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", background: "#f7fafc", padding: "15px 20px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#1a202c" }}>संस्कृत अध्ययन केंद्र</h1>
                    <p style={{ margin: "4px 0 0 0", color: "#718096", fontSize: "14px" }}>Selected Module: {decodedType}</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label htmlFor="chap-select" style={{ fontWeight: 600, color: "#4a5568" }}>अध्याय:</label>
                    {dropdownLoading ? (
                        <span style={{ color: "#a0aec0" }}>Loading...</span>
                    ) : (
                        <select
                            id="chap-select"
                            value={activeChapter}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setActiveChapter(e.target.value)}
                            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0", minWidth: "220px", background: "#fff", cursor: "pointer", outline: "none" }}
                        >
                            {chapters.map((chap, idx) => (
                                <option key={idx} value={chap}>{chap}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Main Application State Loader */}
            {contentLoading ? (
                <div style={{ textAlign: "center", padding: "60px 0", fontSize: "18px", color: "#4a5568" }}>
                    <div style={{ display: "inline-block", width: "30px", height: "30px", border: "3px solid #e2e8f0", borderTopColor: "#3182ce", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "10px" }}></div>
                    <div>पाठ्यसामग्री लोड हो रही है... Please wait.</div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : contentResponse ? (
                <div>

                    {/* Chapter Summary Block */}
                    {chapterSummary && (
                        <div style={{ background: "#ebf8ff", borderLeft: "4px solid #3182ce", padding: "15px 20px", borderRadius: "0 8px 8px 0", marginBottom: "25px" }}>
                            <h3 style={{ margin: "0 0 8px 0", color: "#2b6cb0", fontSize: "16px", fontWeight: "bold" }}>अध्याय सारांश (Summary)</h3>
                            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#2d3748", whiteSpace: "pre-line" }}>{chapterSummary}</p>
                        </div>
                    )}

                    {/* Navigation Tab Bar Layout */}
                    <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "25px", gap: "5px", overflowX: "auto" }}>
                        {(["explanations", "grammar_vocab", "questions", "textbook"] as TabType[]).map((tab) => {
                            const labelMap: Record<TabType, string> = {
                                explanations: "श्लोक व्याख्या एवं भावार्थ",
                                grammar_vocab: "व्याकरण एवं शब्दार्थ",
                                questions: "महत्वपूर्ण प्रश्न (MCQs/Extracts)",
                                textbook: "अभ्यास समाधान (Exercises)"
                            };
                            const isSelected = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{ padding: "12px 20px", border: "none", background: "none", borderBottom: isSelected ? "3px solid #dd6b20" : "3px solid transparent", color: isSelected ? "#dd6b20" : "#4a5568", fontWeight: isSelected ? "bold" : "normal", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", fontSize: "15px" }}
                                >
                                    {labelMap[tab]}
                                </button>
                            );
                        })}
                    </div>

                    {/* --- TAB 1: EXPLANATIONS --- */}
                    {activeTab === "explanations" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {notesList.filter(n => n.nodeType === "narrative_note" && n.analysis?.note).map((item, index) => (
                                <div key={index} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                    <div style={{ background: "#fffaf0", borderBottom: "1px solid #feebc8", padding: "12px 20px", fontWeight: "bold", color: "#c05621" }}>
                                        प्रसंग / विषय-वस्तु {index + 1}: {item.sectionOrTheme}
                                    </div>
                                    <div style={{ padding: "20px", background: "#fff" }}>
                                        <div style={{ fontSize: "18px", color: "#2d3748", fontStyle: "italic", textAlign: "center", margin: "10px 0 20px 0", background: "#f7fafc", padding: "15px", borderRadius: "6px", border: "1px dashed #cbd5e0", whiteSpace: "pre-line", fontWeight: 500 }}>
                                            {item.analysis.note}
                                        </div>
                                        {item.analysis.anvayaAndBhavarth && (
                                            <div style={{ marginBottom: "15px" }}>
                                                <strong style={{ color: "#4a5568", display: "block", marginBottom: "5px" }}>अन्वय और भावार्थ:</strong>
                                                <div style={{ background: "#f8f9fa", padding: "12px 15px", borderRadius: "6px", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                                                    {item.analysis.anvayaAndBhavarth}
                                                </div>
                                            </div>
                                        )}
                                        {item.analysis.explanation && (
                                            <div>
                                                <strong style={{ color: "#4a5568", display: "block", marginBottom: "5px" }}>व्याख्या (Explanation):</strong>
                                                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>{item.analysis.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- TAB 2: GRAMMAR & VOCABULARY --- */}
                    {activeTab === "grammar_vocab" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                            {notesList.filter(n => n.nodeType === "narrative_note").map((item, index) => {
                                const grammar = item.analysis?.vyakaranGrammar || [];
                                const vocab = item.analysis?.contextualVocabulary || [];
                                const tip = item.analysis?.criticalAnalysisTip;

                                if (grammar.length === 0 && vocab.length === 0) return null;

                                return (
                                    <div key={index} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", background: "#fff" }}>
                                        <h4 style={{ margin: "0 0 15px 0", color: "#2c5282", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", fontSize: "16px" }}>
                                            📦 व्याकरण विश्लेषण: {item.sectionOrTheme}
                                        </h4>

                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                                            {/* Vocabulary Sub-Table */}
                                            {vocab.length > 0 && (
                                                <div>
                                                    <span style={{ fontWeight: "bold", display: "block", marginBottom: "8px", color: "#4a5568" }}>कठिन शब्दार्थ (Vocabulary)</span>
                                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                                        <thead>
                                                            <tr style={{ background: "#edf2f7", textAlign: "left" }}>
                                                                <th style={{ padding: "8px", border: "1px solid #cbd5e0" }}>शब्द</th>
                                                                <th style={{ padding: "8px", border: "1px solid #cbd5e0" }}>अर्थ</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {vocab.map((v: any, i: number) => (
                                                                <tr key={i}>
                                                                    <td style={{ padding: "8px", border: "1px solid #cbd5e0", fontWeight: "bold", color: "#2b6cb0" }}>{v.word}</td>
                                                                    <td style={{ padding: "8px", border: "1px solid #cbd5e0" }}>{v.meaning}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* Grammar Breakdown List */}
                                            {grammar.length > 0 && (
                                                <div>
                                                    <span style={{ fontWeight: "bold", display: "block", marginBottom: "8px", color: "#4a5568" }}>व्याकरण / सन्धि / विग्रह</span>
                                                    <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", lineHeight: "1.8" }}>
                                                        {grammar.map((g: string, i: number) => (
                                                            <li key={i} style={{ color: "#2d3748" }}>{g}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Board Tip Alert */}
                                        {tip && (
                                            <div style={{ marginTop: "15px", background: "#fff5f5", border: "1px solid #fed7d7", padding: "10px 15px", borderRadius: "6px", fontSize: "13px", color: "#c53030" }}>
                                                💡 <strong>परीक्षा युक्ति (Exam Tip):</strong> {tip}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* --- TAB 3: QUESTIONS & MCQS --- */}
                    {activeTab === "questions" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                            {notesList.map((item, idx) => {
                                const extracts = item.cbseExtractBasedQuestions || [];
                                const mcqs = item.quickCheckMCQs || [];

                                if (extracts.length === 0 && mcqs.length === 0) return null;

                                return (
                                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                        {/* Extract Based Passage Questions */}
                                        {extracts.map((ex: any, eIdx: number) => (
                                            <div key={eIdx} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", background: "#fff" }}>
                                                <span style={{ background: "#e2e8f0", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", uppercase: "true" }}>CBSE EXTRACT BASED QUESTION</span>
                                                <p style={{ fontStyle: "italic", background: "#f7fafc", padding: "12px", borderLeft: "3px solid #4a5568", margin: "10px 0" }}>"{ex.verbatimExcerpt}"</p>
                                                {ex.questions?.map((q: any, qIdx: number) => (
                                                    <div key={qIdx} style={{ marginTop: "10px", fontSize: "14px" }}>
                                                        <strong>Q: {q.questionText} <small style={{ color: "#718096" }}>({q.questionType})</small></strong>
                                                        <p style={{ margin: "5px 0 0 0", color: "#2f855a", background: "#f0fff4", padding: "8px 12px", borderRadius: "4px" }}>✔ <strong>उत्तर:</strong> {q.modelAnswer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}

                                        {/* Quick Check Multiple Choice items */}
                                        {mcqs.map((mcq: any, mIdx: number) => (
                                            <div key={mIdx} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", background: "#fff" }}>
                                                <span style={{ background: "#feebc8", color: "#c05621", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>QUICK CHECK MCQ</span>
                                                <p style={{ fontWeight: "bold", margin: "10px 0" }}>{mcq.question}</p>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
                                                    {mcq.options?.map((opt: string, oIdx: number) => {
                                                        const isCorrect = opt === mcq.answer;
                                                        return (
                                                            <div key={oIdx} style={{ padding: "8px 12px", borderRadius: "4px", border: isCorrect ? "1px solid #38a169" : "1px solid #e2e8f0", background: isCorrect ? "#f0fff4" : "#fff", color: isCorrect ? "#276749" : "#4a5568", fontWeight: isCorrect ? "bold" : "normal" }}>
                                                                {oIdx + 1}. {opt} {isCorrect && " 🌟"}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* --- TAB 4: TEXTBOOK EXERCISES --- */}
                    {activeTab === "textbook" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {notesList.filter(n => n.nodeType === "textbook_exercise_section").map((item, index) => (
                                <div key={index}>
                                    <h3 style={{ color: "#2c5282", marginBottom: "15px" }}>📝 पाठ्यपुस्तक अभ्यास समाधान (NCERT/CBSE Exercise Solutions)</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                        {item.fullTextbookSolutions?.map((sol: any, sIdx: number) => (
                                            <div key={sIdx} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "15px 20px" }}>
                                                <div style={{ fontWeight: "bold", color: "#4a5568", fontSize: "15px", marginBottom: "6px" }}>
                                                    <span style={{ color: "#3182ce", marginRight: "6px" }}>{sol.questionNumber}</span> {sol.textbookQuestion}
                                                </div>
                                                <div style={{ background: "#f7fafc", padding: "10px 15px", borderRadius: "6px", fontSize: "14px", color: "#2d3748", borderLeft: "3px solid #3182ce", lineHeight: "1.7" }}>
                                                    <strong>समाधानम्:</strong> {sol.modelAnswer}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "40px", color: "#718096" }}>Please pick a valid chapter to display learning items.</div>
            )}
        </div>
    );
};

export default SanskritNotes;