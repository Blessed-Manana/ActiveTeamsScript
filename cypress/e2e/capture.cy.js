const names = [
    'Sanelisiwe Sfumba',
    'Indiphile Phiri',
    'Bandile Dlamini',
    'Antonio Nah',
    'Aphiwe Shelambe',
    'Beleive Mncube',
    'Benjamin michee',
    'Benji Mangwani',
    'Blessing Masaire',
    'Blessing Kanjinga',
    'Boitumelo Tsamai',
    'Bokang Molapisi',
    'Bonga Zungu',
    'Bonginkosi Mhlanga',
    'Calib Derbyshire',
    'Daniel Danza',
    'Darlin NdiriCinpa',
    'David Mbumba',
    'David Bonyoma',
    'Elijah Kilolomulumba',
    'Ellenique Hodgeson',
    'Emmanuel Bakula',
    'Francine Dimuangi',
    'Gift Kalombo',
    'Gift Andile Ajibade',
    'Gontse Ngembezi',
    'Helder Mathe',
    'Honore Yombo',
    'Iminathi Saul',
    'James Sibanda',
    'Jeremiah Kalembo',
    'Joel Mabeki',
    'John Mukongo',
    'Jonathan Shango',
    'Jordan Ngambu'
];

describe('Ignore App Errors', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes("Cannot read properties of undefined (reading 'map')")) {
            return false; // ignore this error
        }
    });

    it('Capture', () => {

        cy.intercept('GET', 'https://script.google.com/macros/s/AKfycbw1X9HsSzBiLbfiLeW1MizAPx3ypSuGX-PGhxZ_GO-SEqO3w2ugQ1EN9F7GnDVbSANayA/exec?name=AllPeople')
            .as('getAllPeople');

        cy.intercept('GET', 'https://script.google.com/macros/s/AKfycbxbcWgYLMEnRukU_Vg589GY-PWNKd-047B2EiTBtGbu0IVxyiTRSZfbw-P_lmuwmw8fog/exec?name=Blessed%20Manana')
            .as('getAllTasks');

        cy.intercept('POST', 'https://script.google.com/macros/s/AKfycbwygPINKKnISe4v6opwC8Jozh1HNmCiINonb3EczAB2-eAzKwey4dN3pQ633oiqj45nXA/exec')
            .as('postTask');
        cy.visit('https://teams.theactivechurch.org');
        cy.clearLocalStorage();

        cy.window().then((win) => {
            win.localStorage.setItem('loggedIn', 'true');
            win.localStorage.setItem('authUser', JSON.stringify({
                success: true,
                message: 'Login successful.',
                id: 676885,
                name: 'Blessed',
                surname: 'Manana',
                email: 'mananablessed01@gmail.com',
                role: 'Registrant'
            }));
        });

        cy.reload();

        cy.wait('@getAllPeople').then(() => {
            cy.get('[data-testid="MenuIcon"] > path').click();
            cy.contains('div', 'My Tasks').click();
        });

        cy.wait(10000)        
        cy.get('button').contains('Log Pastoral Call Task').should('exist');
        // cy.wait('@getAllTasks').then(() => {
        // });

        function capture(numOfPeople) {
            const performCapture = (name) => {
                cy.get('button').contains('Log Pastoral Call Task').click();
                cy.get('div').contains('Awaiting Call').click();
                cy.get('[data-value="proper-connect-Cell-request"]').click();
                cy.get(':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root').type(name);

                cy.get('div').contains('Blessed Manana').should('be.visible', { force: true });
                cy.get('[aria-labelledby="task-stage-label"]').contains('Open').click();
                cy.get('li').contains('Closed').click({ force: true });
                cy.get('button').contains('Finish').click();

                cy.wait('@postTask');
                cy.wait(2000);
            };

            // --- Handle 'all' or number input ---
            const selectedNames = numOfPeople === 'all' ? names : names.slice(0, numOfPeople);

            selectedNames.forEach(performCapture);
        }


        capture(30)

    });
});
