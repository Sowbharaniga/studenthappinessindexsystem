
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
            <div className={`p-8 rounded-3xl border-2 ${color} mb-8`}>
                <div className="text-6xl mb-4">{emoji}</div>
                <h2 className="text-3xl font-bold mb-2">{score}%</h2>
                <p className="text-lg font-medium opacity-80">{status}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">Thank you!</h3>
                <p className="text-gray-500 text-sm">
                    Your response has been recorded. You can now close this window or return later to see if your score changes.
                </p>
            </div>
        </div>
    );
}
