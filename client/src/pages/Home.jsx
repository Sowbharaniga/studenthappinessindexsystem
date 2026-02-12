import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome</h1>
                <p className="mb-8 text-gray-600">Select your login type to continue</p>

                <div className="space-y-4">
                    <Link
                        to="/login"
                        className="block w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Student Login
                    </Link>

                    <Link
                        to="/admin/login"
                        className="block w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition"
                    >
                        Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
