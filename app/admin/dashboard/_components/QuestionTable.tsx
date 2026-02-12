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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Manage Questions</h3>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Question
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Question Text</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {questions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 max-w-md truncate" title={q.text}>
                                    {q.text}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {q.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${q.status === "ACTIVE"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                        }`}>
                                        {q.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(q)}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
