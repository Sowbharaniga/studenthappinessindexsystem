
export default function ResultCard({ score }: { score: number }) {
    let status = "";
    let color = "";
    let emoji = "";

    if (score >= 80) {
        status = "Very Happy";
        color = "text-green-600 bg-green-50 border-green-200";
        emoji = "🤩";
    } else if (score >= 60) {
        status = "Happy";
        color = "text-blue-600 bg-blue-50 border-blue-200";
        emoji = "🙂";
    } else if (score >= 40) {
        status = "Neutral";
        color = "text-yellow-600 bg-yellow-50 border-yellow-200";
        emoji = "😐";
    } else {
        status = "Unhappy";
        color = "text-red-600 bg-red-50 border-red-200";
        emoji = "😟";
    }

    return (
        <div className="max-w-md mx-auto text-center">
            <div className={`p-10 rounded-[32px] border-2 ${color} mb-10 shadow-sm transition-all hover:shadow-md`}>
                <div className="text-7xl mb-6">{emoji}</div>
                <h2 className="text-5xl font-black mb-3">{score}%</h2>
                <p className="text-xl font-bold opacity-90 uppercase tracking-wide">{status}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F1F5F9]">
                <h3 className="text-xl font-extrabold text-[#0F172A] mb-3">Thank you!</h3>
                <p className="text-[#64748B] text-base font-medium leading-relaxed">
                    Your response has been recorded. Your feedback helps us build a happier campus for everyone.
                </p>
            </div>
        </div>
    );
}
