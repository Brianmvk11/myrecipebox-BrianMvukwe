import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const token = localStorage.getItem("access_token");
    const navigate = useNavigate();

    // console.log(token)
    if (!token) {
        console.error("No token found, please log in");
        navigate("/");
    }
    return (
        <h1>This is the dashboard</h1>
    )
}