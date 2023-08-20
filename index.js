const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    //part1
    await page.goto('http://172.16.1.250:8081/jasperserver/login.html');
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const usernameInput = await page.$('#j_username');
    await usernameInput.type('student');
    const passwordInput = await page.$('#j_password_pseudo');
    await passwordInput.type('student');
    const loginButton = await page.$('#submitButton');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await loginButton.click();
    await page.waitForNavigation();
    
    //part2
    await page.goto('http://172.16.1.250:8081/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FStudents&reportUnit=%2FStudents%2FResult_of_All_Semesters&standAlone=true');
    let roll_num = 2021022001;
    while (roll_num <= 2021022015) {
        await page.waitForSelector('#groupBox input[type="text"]');
        const rollNumberField = await page.$('#groupBox input[type="text"]');
        await rollNumberField.click({ clickCount: 3 });
        await rollNumberField.press('Backspace'); // Clear the input field
        await rollNumberField.type(`${roll_num}`);//roll number
        const applyButton = await page.$('#ok');
        await applyButton.click();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        //part3 download
        await page.evaluate(() => {
            Report.exportReport("pdf");
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        //part3 rename
        // "C:/Users/shubh/Downloads/"
        const downloadedFilePath = path.join('C:/Users/shubh/Downloads/', 'Result_of_All_Semesters.pdf'); 
        const newFilePath = path.join('C:/Users/shubh/Downloads/', `${roll_num}.pdf`); // Update the path with the desired directory
        fs.renameSync(downloadedFilePath, newFilePath);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Refresh the page
        roll_num++;
        await page.reload();
    }


    await browser.close();
})();
