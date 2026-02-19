import { test, expect } from '@playwright/test';
import { ResearcherHomePage } from '../pages/ResearcherHomePage';
import { LoginPage } from '../pages/LoginPage';
import { researcherLocators } from '../locators/researcher.locators';
import { getResearcherCredentials } from '../test-data/auth.data';

test.describe('Submit research - 5-step form', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getResearcherCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await page.waitForURL(/\/researcher\/homepage/, { timeout: 15000 });
    // Navigate to researcher form
    await page.goto('/#/researcher-form');
    await page.waitForLoadState('networkidle');
  });

  test('should display and complete step1 → step5', async ({ page }) => {
    //--- Step 1: Researcher info
    await test.step('STEP 1: Researcher info :', async () => {
      await expect(page.getByText(/step 1: researcher info/i)).toBeVisible();
      await test.step('show error when required missing', async () => {
        await page.getByTestId('next-btn').click();
        await expect(page.getByTestId('step-error')).toBeVisible();
        await expect(page.getByTestId('step-error')).toContainText(/กรุณากรอก|fill/i);
        await expect(page.getByText(/step 1: researcher info/i)).toBeVisible();
      });
      await test.step('submit form', async () => {
        await page.getByTestId('coordinatorPrefix').click();
        await page.getByRole('option', { name: /นายแพทย์|Dr\. \(Male\)/ }).click();
        await page.getByTestId('coordinatorAcademicPosition').click();
        await page.getByRole('option', { name: /none/i }).click();
        await page.getByTestId('coordinatorFirstName').fill('QA');
        await page.getByTestId('coordinatorLastName').fill('Tester');
        await page.getByTestId('coordinatorDepartment').fill('Engineering');
        await page.getByTestId('coordinatorPhoneNumber').fill('0812345678');
        await page.getByTestId('coordinatorEmail').fill('qa@test.com');
        await page.getByTestId('next-btn').click();
      });
    });

    await test.step('STEP 2: Research Details :', async () => {
      await expect(page.getByText(/Step 2: Research Details/i)).toBeVisible();
      await test.step('show error when required missing', async () => {
        await page.getByTestId('next-btn').click();
        await expect(page.getByTestId('step-error')).toBeVisible();
        await expect(page.getByTestId('step-error')).toContainText(/กรุณากรอก|fill/i);
        await expect(page.getByText(/Step 2: Research Details/i)).toBeVisible();
      });
      await test.step('submit form', async () => {
        await page.getByTestId(/researchTitle/i).fill('QA TEST Submit form');
        await page.getByTestId(/researchType/i).getByRole('radio').first().click();
        await page.getByTestId(/description/i).fill('Test Innovation Description');
        await page.getByTestId(/keywords/i).fill('Test keywords');
        await page.getByTestId('next-btn').click();
        await expect(page.getByText(/Step 3: TRL Assessment/i)).toBeVisible();

      });
    });

    await test.step('STEP 3: TRL Assessment :', async () => {
      await expect(page.getByText(/Step 3: TRL Assessment/i)).toBeVisible();
      await test.step('show error when required missing', async () => {
        await page.getByTestId('next-btn').click();
        await expect(page.getByTestId('step-error')).toBeVisible();
        await expect(page.getByTestId('step-error')).toContainText(/กรุณากรอก|fill/i);
        await expect(page.getByText(/Step 3: TRL Assessment/i)).toBeVisible();
      });
      await test.step('submit form', async () => {
        await page.getByTestId('rq1-yes').click();
        await page.getByTestId('rq2-yes').click();
        await page.getByTestId('rq3-yes').click();
        await page.getByTestId('rq4-no').click();
        await page.getByTestId('cq7-1').check();
        await page.getByTestId('cq7-2').check();
        await page.getByTestId('cq7-3').check();
        await page.getByTestId('cq7-4').check();
        await page.getByTestId('trl-evaluate-btn').click();

        await page.getByTestId('next-btn').click();
        await expect(page.getByText(/Step 4: Intellectual Property/i)).toBeVisible();
      });
    });

    await test.step('STEP 4: Intellectual Property :', async () => {
      await expect(page.getByText(/Step 4: Intellectual Property/i)).toBeVisible();
      await test.step('show error when required missing', async () => {
        await page.getByTestId('next-btn').click();
        await expect(page.getByTestId('step-error')).toBeVisible();
        await expect(page.getByTestId('step-error')).toContainText(/กรุณาเลือก|select/i);
        await expect(page.getByText(/Step 4: Intellectual Property/i)).toBeVisible();
      });
      await test.step('submit form', async () => {
        await page.getByTestId('ip-no-0').click();
        await page.getByTestId('next-btn').click();
        await expect(page.getByText(/Step 5: Support Needed/i)).toBeVisible();
        await page.getByTestId('prev-btn').click();
        await expect(page.getByText(/Step 4: Intellectual Property/i)).toBeVisible();
        await page.getByTestId('ip-yes-0').click();
        await page.getByTestId('ip-status-progress-0').click();
        await page.getByTestId('ip-type-pettyPatent-0').click();
        await test.step('IP format', async () => {
          const ipTypes = [
            { type: "patent", value: "1234567" },        // 7 digits
            { type: "pettyPatent", value: "2123456" },   // must start with 2
            { type: "designPatent", value: "D123456" },  // D + 6
            { type: "copyright", value: "CR-2024-001" }, // free pattern
            { type: "trademark", value: "12345678" },    // 7-8 digits
            { type: "tradeSecret", value: "secret01" },  // any text
          ];

          for (let i = 1; i < ipTypes.length; i++) {
            await page.getByTestId("ip-add-btn").click();
            await page.getByTestId(`ip-yes-${i}`).click();
            await page.getByTestId(`ip-status-number-${i}`).click();
            await page.getByTestId(`ip-type-${ipTypes[i].type}-${i}`).click();
            await page.getByTestId(`ip-number-${i}`).fill(ipTypes[i].value);
          }
        });
        await page.getByTestId('next-btn').click();
        await expect(page.getByText(/Step 5: Support Needed/i)).toBeVisible();

      });
    });

    await test.step('STEP 5: Support Needed :', async () => {
      await expect(page.getByText(/Step 5: Support Needed/i)).toBeVisible();
      await test.step('show error when required missing', async () => {
        await page.getByTestId('submit-btn').click();
        await expect(page.getByTestId('step-error')).toBeVisible();
        await expect(page.getByTestId('step-error')).toContainText(/กรุณากรอก|fill/i);
        await expect(page.getByText(/Step 5: Support Needed/i)).toBeVisible();
      });
      await test.step('submit form', async () => {
        await page.getByTestId('support-dev-ฝ่ายวิจัย').click();
        await page.getByTestId('support-dev-ศูนย์ขับเคลื่อนคุณค่าการบริการ (Center for Value Driven Care: VDC)').click();
        await page.getByTestId('support-market-การคุ้มครองทรัพย์สินทางปัญญา').click();
        await page.getByTestId('support-market-หาผู้ร่วม/โรงงานผลิตและพัฒนานวัตกรรม').click();
        await page.getByTestId('support-market-หาแหล่งทุน').click();

        await page.getByTestId('submit-btn').click();
        await page.getByTestId('confirm-submit').click();
        await expect(page.getByText(/success|สำเร็จ/i)).toBeVisible();

      });
    });
  });
});
