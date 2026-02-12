const AdminLogin = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input type="text" className="w-full border p-2 rounded" placeholder="Enter Username" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input type="password" className="w-full border p-2 rounded" placeholder="Enter Password" />
                    </div>
                    <button className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-700">
                        Login as Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
