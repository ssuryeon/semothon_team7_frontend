import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    * {
    font-family: "Pretendard", sans-serif;
    }
    @font-face {
        font-family: "Pretendard";
        src: url("/fonts/Pretendard-Regular.woff2") format("woff2");
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: "Pretendard";
        src: url("/fonts/Pretendard-Medium.woff2") format("woff2");
        font-weight: 500;
        font-style: normal;
    }
    @font-face {
        font-family: "Pretendard";
        src: url("/fonts/Pretendard-Bold.woff2") format("woff2");
        font-weight: 700;
        font-style: normal;
    }
    body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        background-color: #eee;
    }
    #root {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    a {
        text-decoration: none;
    }
    .app {
        width: 100%;
        max-width: 430px;
        min-height: 100vh;
        box-sizing: border-box;
    }
    @media (max-width: 430px) {
        .app {
            max-width: 100%;
        }
    }
`;