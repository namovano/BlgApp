*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${URL}            http://localhost:8080
${BROWSER}        Chrome
${USERNAME}       testuser
${EMAIL}          test@example.com
${PASSWORD}       SEcret123!
${POST_TITLE}     Тестовий пост
${POST_BODY}      Це контент тестового посту

*** Test Cases ***
Реєстрація користувача та створення посту
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    # 1. Перехід на сторінку реєстрації
    # Click Link    Register
    Click Link    Or Sign Up

    Input Text    name=username    ${USERNAME}
    Input Text    name=email       ${EMAIL}
    Input Text    name=password    ${PASSWORD}
    Input Text    id=confirm       ${PASSWORD}
    Click Element    id=register

    # 2. Логін
    Go To    ${URL}
    Sleep    1s
    Input Text    name=username     ${USERNAME}
    Input Text    name=password    ${PASSWORD}
    Click Element    id=login

    # 3. Створення посту
    Go To    ${URL}/post
    Sleep    1s
    Input Text    id=title       ${POST_TITLE}
    Input Text    id=description        ${POST_BODY}
    Input Text    id=body        ${POST_BODY}
    Click Element  id=post
    [Teardown]    Close Browser
