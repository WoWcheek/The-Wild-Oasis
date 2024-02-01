import { createContext, useContext, useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledToggle = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-700);
    }
`;

const StyledList = styled.ul`
    position: absolute;
    right: ${(props) => props.position.x}px;
    top: ${(props) => props.position.y}px;
    z-index: 1;

    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);
`;

const StyledButton = styled.button`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    transition: all 0.2s;

    display: flex;
    align-items: center;
    gap: 1.6rem;

    &:hover {
        background-color: var(--color-grey-50);
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }
`;

const MenusContext = createContext();

function Menus({ children }) {
    const [openId, setOpenId] = useState("");
    const [position, setPosition] = useState(null);
    const close = () => setOpenId("");

    return (
        <MenusContext.Provider
            value={{ openId, setOpenId, close, position, setPosition }}
        >
            {children}
        </MenusContext.Provider>
    );
}

function Toggle({ id }) {
    const { openId, setOpenId, close, setPosition } = useContext(MenusContext);

    function handleClick(e) {
        const rect = e.target.closest("button").getBoundingClientRect();

        const margin = 8;
        setPosition({
            x: -margin,
            y: rect.height
        });

        openId === "" || openId !== id ? setOpenId(id) : close();
    }

    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
}

function List({ id, children }) {
    const { openId, position, close } = useContext(MenusContext);

    const ref = useOutsideClick(close);

    if (openId !== id) return null;

    return (
        <StyledList position={position} ref={ref}>
            {children}
        </StyledList>
    );
}

function Button({ icon, onClick, children }) {
    const { close } = useContext(MenusContext);

    function handleClick() {
        onClick?.();
        close();
    }

    return (
        <li>
            <StyledButton onClick={handleClick}>
                {icon}
                <span>{children}</span>
            </StyledButton>
        </li>
    );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
