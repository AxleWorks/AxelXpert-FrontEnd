// import { useState } from 'react';
// import { login, signup } from '../services/api';

// const useAuth = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const loginUser = async (email, password) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await login(email, password);
//             setUser(response.data || response);
//         } catch (err) {
//             if (err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError(String(err));
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const signupUser = async (email, password, name) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await signup(name || '', email, password);
//             setUser(response.data || response);
//         } catch (err) {
//             if (err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError(String(err));
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { loginUser, signupUser, user, loading, error };
// };

// export default useAuth;
