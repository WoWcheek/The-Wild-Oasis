import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    justify-content: center;
    align-items: center;
`;

function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const { isAuthenticated, isPending } = useUser();

    useEffect(
        function () {
            if (!isAuthenticated && !isPending) navigate("/login");
        },
        [isAuthenticated, isPending, navigate]
    );

    if (isPending)
        return (
            <FullPage>
                <Spinner />
            </FullPage>
        );

    return children;
}

export default ProtectedRoute;
