const StudentLogin = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Student Login</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Roll Number</label>
                        <input type="text" className="w-full border p-2 rounded" placeholder="Enter Roll Number" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input type="password" className="w-full border p-2 rounded" placeholder="Enter Password" />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentLogin;
