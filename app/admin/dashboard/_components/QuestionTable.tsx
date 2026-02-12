"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";

interface Question {
    id: string;
    text: string;
    category: string;
    status: "ACTIVE" | "INACTIVE";
}

export default function QuestionTable() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch("/api/admin/questions");
            const data = await res.json();
            setQuestions(data);
        } catch (error) {
            console.error("Failed to fetch questions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;

        try {
            const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
            if (res.ok) {
                setQuestions(questions.filter(q => q.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete question", error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isEditing
                ? `/api/admin/questions/${currentQuestion.id}`
                : "/api/admin/questions";

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentQuestion),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchQuestions();
                setCurrentQuestion({});
            }
        } catch (error) {
            console.error("Failed to save question", error);
        } finally {
            setSaving(false);
        }
    };

    const openAddModal = () => {
        setCurrentQuestion({ status: "ACTIVE", category: "Academics" });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (question: Question) => {
        setCurrentQuestion(question);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const categories = [
        "Academics",
        "Facilities & Infrastructure",
        "Learning Resources",
        "Personal Well-being",
        "Social & Campus Life",
        "Career & Growth",
        "Overall"
    ];

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-500" /></div>;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-[#F1F5F9] overflow-hidden animate-fade-in">
            <div className="px-8 py-8 border-b border-gray-100 flex items-center justify-between bg-white">
                <div>
                    <h3 className="text-xl font-extrabold text-[#0F172A]">Manage Questions</h3>
                    <p className="text-sm font-medium text-gray-500">Curate and organize surveys for student feedback</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    New Question
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#F8FAFC] border-y border-gray-100/50 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        <tr>
                            <th className="px-8 py-5">Question Text</th>
                            <th className="px-8 py-5">Category</th>
                            <th className="px-8 py-5 text-center">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                        {questions.map((q, idx) => (
                            <tr key={q.id} className={`hover:bg-indigo-50/30 transition-colors group ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                                <td className="px-8 py-6 font-bold text-[#0F172A] max-w-md truncate" title={q.text}>
                                    {q.text}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white text-indigo-600 border border-gray-200 shadow-sm">
                                        {q.category}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm ${q.status === "ACTIVE"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${q.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {q.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => openEditModal(q)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white hover:border-gray-200 border border-transparent rounded-xl hover:shadow-md transition-all hover:scale-110"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-white hover:border-gray-200 border border-transparent rounded-xl hover:shadow-md transition-all hover:scale-110"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No questions found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-semibold text-gray-900">
                                {isEditing ? "Edit Question" : "Add New Question"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Text
                                </label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    rows={3}
                                    value={currentQuestion.text || ""}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                    placeholder="Enter survey question..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={currentQuestion.category || ""}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={currentQuestion.status || "ACTIVE"}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isEditing ? "Save Changes" : "Create Question"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
